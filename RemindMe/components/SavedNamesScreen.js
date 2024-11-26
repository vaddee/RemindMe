// SavedNamesScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import ReminderModal from './ReminderModal';
import PersonItem from './PersonItem';
import { useFocusEffect } from '@react-navigation/native';

export default function SavedNamesScreen() {
  const [savedPersons, setSavedPersons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [daysBefore, setDaysBefore] = useState('');

  const fetchPersons = async () => {
    if (!auth.currentUser) return;
    const personsRef = collection(db, `users/${auth.currentUser.uid}/persons`);
    const snapshot = await getDocs(personsRef);
    const personsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setSavedPersons(personsList);
  };

  useEffect(() => {
    fetchPersons();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    requestPermissions();
  }, []);

  // Lisää tämä hook, jotta näkymä hakee tiedot aina kun käyttäjä palaa siihen
  useFocusEffect(
    useCallback(() => {
      fetchPersons();
    }, [])
  );


  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log("Notification permission status:", status);
    if (status !== 'granted') {
      Alert.alert("Ilmoituslupaa ei myönnetty");
    }
  };

  const handleAddReminder = (person) => {
    setSelectedPerson(person);
    setModalVisible(true);
  };

  const handleSaveReminder = async () => {
    if (!daysBefore || isNaN(daysBefore) || daysBefore <= 0) {
      alert("Syötä positiivinen luku päivien määräksi.");
      return;
    }
    await saveReminderToFirestore(selectedPerson, daysBefore);
    scheduleNotification(selectedPerson, daysBefore);
    setModalVisible(false);
    setDaysBefore('');
  };

  const saveReminderToFirestore = async (person, daysBefore) => {
    try {
      const remindersRef = collection(db, `users/${auth.currentUser.uid}/persons/${person.id}/reminders`);
      await addDoc(remindersRef, {
        daysBefore: parseInt(daysBefore, 10),
        createdAt: new Date(),
      });
      alert(`Muistutus lisätty ${daysBefore} päivää ennen henkilön ${person.name} syntymäpäivää.`);
    } catch (error) {
      console.error("Virhe muistutusta lisätessä:", error);
      alert("Muistutusta ei voitu lisätä.");
    }
  };

 /*  const scheduleNotification = (person, daysBefore) => {
    const [day, month, year] = person.birthday.split('.').map(Number); // Muunna syntymäpäivä Date-objektiksi
    const birthday = new Date(year, month - 1, day);
    const reminderDate = new Date(birthday);
    reminderDate.setDate(birthday.getDate() - daysBefore);
  
    const trigger = new Date(reminderDate);
    trigger.setHours(9, 0, 0);
  
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Muistutus",
        body: `${person.name} täyttää pian vuosia!`,
        sound: true,
      },
      trigger,
    });
  }; */
  const scheduleNotification = (person, daysBefore) => {
    console.log(`Scheduling notification for ${person.name} in 1 minute`);
    const testTrigger = new Date(Date.now() + 10000); // 10sec nykyhetkestä testin vuoksi
    
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Testi-ilmoitus",
        body: `${person.name} täyttää pian vuosia!`,
        sound: true,
      },
      trigger: testTrigger,
    });
  };
  
  
  const handleDeletePerson = async (person) => {
    Alert.alert(
      "Poista henkilö",
      `Haluatko varmasti poistaa henkilön ${person.name}?`,
      [
        { text: "Peruuta" },
        {
          text: "Poista",
          onPress: async () => {
            try {
              const personRef = doc(db, `users/${auth.currentUser.uid}/persons/${person.id}`);
              await deleteDoc(personRef);
              Alert.alert("Henkilö poistettu!");
  
              // Päivitetään savedPersons-tila poistamisen jälkeen
              setSavedPersons((prevPersons) => prevPersons.filter((p) => p.id !== person.id));
            } catch (error) {
              console.error("Virhe henkilöä poistaessa:", error);
              Alert.alert("Virhe henkilöä poistaessa.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={savedPersons}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <PersonItem person={item}
         onAddReminder={handleAddReminder}
         onDelete={handleDeletePerson} />}
      />
      <ReminderModal
        visible={modalVisible}
        selectedPerson={selectedPerson}
        daysBefore={daysBefore}
        setDaysBefore={setDaysBefore}
        onSave={handleSaveReminder}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}
