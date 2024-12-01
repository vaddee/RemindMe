// SavedNamesScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import ReminderModal from './ReminderModal';
import PersonItem from './PersonItem';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message'; // Importoidaan Toast
import CustomToast from '../styles/CustomToast'; // Importoidaan CustomToast

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
      Toast.show({
        type: 'customToast',
        text1: 'Ilmoituslupa',
        text2: 'Ilmoituslupaa ei myönnetty.',
      });
    }
  };

  const handleAddReminder = (person) => {
    setSelectedPerson(person);
    setModalVisible(true);
  };

  const handleSaveReminder = async () => {
    if (!daysBefore || isNaN(daysBefore) || daysBefore <= 0) {
      Toast.show({
        type: 'customToast',
        text1: 'Virhe',
        text2: 'Syötä positiivinen luku päivien määräksi.',
      });
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
      Toast.show({
        type: 'customToast',
        text1: 'Muistutus lisätty',
        text2: `${daysBefore} päivää ennen henkilön ${person.name} syntymäpäivää.`,
      });
    } catch (error) {
      console.error("Virhe muistutusta lisätessä:", error);
      Toast.show({
        type: 'customToast',
        text1: 'Virhe',
        text2: 'Muistutusta ei voitu lisätä.',
      });
    }
  };

  /*
  const scheduleNotification = (person, daysBefore) => {
  const [day, month] = person.birthday.split('.').map(Number); // Oletetaan, että birthday on "20.5.1996"
  const currentYear = new Date().getFullYear(); // Käytä nykyistä vuotta
  const nextBirthday = new Date(currentYear, month - 1, day); // Luo syntymäpäivä nykyiselle vuodelle

  // Jos syntymäpäivä on jo mennyt tänä vuonna, käytä seuraavaa vuotta
  if (nextBirthday < new Date()) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  const reminderDate = new Date(nextBirthday);
  reminderDate.setDate(nextBirthday.getDate() - daysBefore); // Vähennetään päivät muistutusta varten

  console.log(`Scheduling notification for ${person.name} on ${reminderDate.toISOString()}`);

  // Asetetaan muistutus
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Muistutus",
      body: `${person.name} täyttää pian vuosia!`,
      sound: true,
    },
    trigger: {
      date: reminderDate,
    },
  });
};
  */

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
    Toast.show({
      type: 'customToast',
      text1: 'Henkilön poistaminen',
      text2: `Poistetaan henkilö ${person.name}...`,
    });
    try {
      const personRef = doc(db, `users/${auth.currentUser.uid}/persons/${person.id}`);
      await deleteDoc(personRef);
      setSavedPersons((prevPersons) => prevPersons.filter((p) => p.id !== person.id));
      Toast.show({
        type: 'customToast',
        text1: 'Poistettu',
        text2: `${person.name} poistettiin onnistuneesti.`,
      });
    } catch (error) {
      console.error("Virhe henkilöä poistaessa:", error);
      Toast.show({
        type: 'customToast',
        text1: 'Virhe',
        text2: 'Henkilöä ei voitu poistaa.',
      });
    }
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
        type="birthday" // Kerrotaan, että tämä on syntymäpäivä
      />
      <Toast config={{ customToast: (props) => <CustomToast {...props} /> }} /> {/* Mukautettu toast */}
    </View>
  );
}
