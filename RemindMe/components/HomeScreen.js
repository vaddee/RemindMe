import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import buttonStyles from '../styles/buttonStyles';
import textStyles from '../styles/textStyles'; // Importoidaan textStyles
import Toast from 'react-native-toast-message';
import CustomToast from '../styles/CustomToast'; // Importoidaan CustomToast

export default function HomeScreen({ user }) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [intrest, setInterst] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchReminders(); // Hakee tiedot aina, kun käyttäjä siirtyy tähän näkymään
    }, [])
  );

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
      Toast.show({
        type: 'customToast',
        text1: 'Virhe',
        text2: 'Täytä sekä nimi että syntymäpäivä.',
      });
      return;
    }

    try {
      if (!user?.uid) {
        Toast.show({
          type: 'customToast',
          text1: 'Virhe',
          text2: 'Käyttäjä ei ole määritelty.',
        });
        return;
      }

      await addDoc(collection(db, `users/${user.uid}/persons`), {
        name: name,
        birthday: birthday,
        intrest: intrest,
      });

      Toast.show({
        type: 'customToast',
        text1: 'Onnistui!',
        text2: `Tallennettiin nimi: ${name}, syntymäpäivä: ${birthday}, kiinnostuksen kohde: ${intrest}`,
      });

      setName('');
      setBirthday('');
    } catch (error) {
      console.log('Error saving document:', error);
      Toast.show({
        type: 'customToast',
        text1: 'Virhe',
        text2: 'Tietojen tallentaminen epäonnistui: ' + error.message,
      });
    }
  };

  return (
    <View style={{ padding: 16, marginTop: 100 }}>
      <Text style={textStyles.header}>Syötä nimi ja syntymäpäivä</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        placeholder="Syötä nimi"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        placeholder="Kiinnostuksen kohde"
        value={intrest}
        onChangeText={setInterst}
      />

      <TouchableOpacity onPress={showDatePicker} style={buttonStyles.button}>
        <Text style={buttonStyles.buttonText}>Valitse syntymäpäivä</Text>
      </TouchableOpacity>

      {birthday && <Text style={textStyles.highlight}>Syntymäpäivä: {birthday}</Text>}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity onPress={savePerson} style={buttonStyles.button}>
        <Text style={buttonStyles.buttonText}>Tallenna</Text>
      </TouchableOpacity>

      <Text style={textStyles.header}>Tulevat muistutukset</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text style={textStyles.subHeader}>Henkilö: {item.name}</Text>
            <Text style={textStyles.bodyText}>Syntymäpäivä: {item.birthday}</Text>
            <Text style={textStyles.bodyText}>Muistutus {item.daysBefore} päivää ennen syntymäpäivää</Text>
          </View>
        )}
      />

      {/* Mukautettu Toast-komponentti */}
      <Toast config={{ customToast: (props) => <CustomToast {...props} /> }} />
    </View>
  );
}
