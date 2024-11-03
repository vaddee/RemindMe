import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';

export default function HomeScreen({ user }) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      fetchReminders();
    }
    
    // Kuuntelee ilmoituksen saapumista ja näyttää alertin
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      Alert.alert(
        title,
        body,
        [{ text: "OK", onPress: () => console.log("Ilmoitus hyväksytty") }]
      );
    });

    // Puhdistaa kuuntelijan, kun komponentti unmountataan
    return () => subscription.remove();
  }, [user]);

  const fetchReminders = async () => {
    try {
      const remindersRef = collection(db, `users/${user.uid}/persons`);
      const personsSnapshot = await getDocs(remindersRef);
      const reminderList = [];

      for (const personDoc of personsSnapshot.docs) {
        const personData = personDoc.data();
        const remindersSubcollection = collection(db, `users/${user.uid}/persons/${personDoc.id}/reminders`);
        
        const remindersSnapshot = await getDocs(remindersSubcollection);
        remindersSnapshot.forEach((reminderDoc) => {
          const reminderData = reminderDoc.data();
          reminderList.push({
            id: reminderDoc.id,
            name: personData.name,
            birthday: personData.birthday,
            daysBefore: reminderData.daysBefore,
          });
        });
      }
      setReminders(reminderList);
    } catch (error) {
      console.log('Error fetching reminders:', error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    const formattedDate = `${selectedDate.getDate()}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`;
    setBirthday(formattedDate);
    hideDatePicker();
  };

  const savePerson = async () => {
    if (name === '' || !birthday) {
      Alert.alert('Virhe', 'Täytä sekä nimi että syntymäpäivä.');
      return;
    }

    try {
      if (!user?.uid) {
        Alert.alert('Virhe', 'Käyttäjä ei ole määritelty.');
        return;
      }

      await addDoc(collection(db, `users/${user.uid}/persons`), {
        name: name,
        birthday: birthday,
      });

      Alert.alert('Onnistui!', `Tallennettiin nimi: ${name}, syntymäpäivä: ${birthday}`);
      setName('');
      setBirthday('');
    } catch (error) {
      console.log('Error saving document:', error);
      Alert.alert('Virhe', 'Tietojen tallentaminen epäonnistui: ' + error.message);
    }
  };

  return (
    <View style={{ padding: 16, marginTop: 100 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Syötä nimi ja syntymäpäivä</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        placeholder="Syötä nimi"
        value={name}
        onChangeText={setName}
      />
      
      <Button title="Valitse syntymäpäivä" onPress={showDatePicker} />
      {birthday && <Text style={{ marginVertical: 8 }}>Syntymäpäivä: {birthday}</Text>}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Button title="Tallenna" onPress={savePerson} />

      {/* Tulevat muistutukset */}
      <Text style={{ fontSize: 24, marginVertical: 16 }}>Tulevat muistutukset</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>Henkilö: {item.name}</Text>
            <Text>Syntymäpäivä: {item.birthday}</Text>
            <Text>Muistutus {item.daysBefore} päivää ennen syntymäpäivää</Text>
          </View>
        )}
      />
    </View>
  );
}
