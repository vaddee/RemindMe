// SavedNamesScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import ReminderModal from './ReminderModal';
import PersonItem from './PersonItem';

export default function SavedNamesScreen() {
  const [savedPersons, setSavedPersons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [daysBefore, setDaysBefore] = useState('');

  useEffect(() => {
    const fetchPersons = async () => {
      if (!auth.currentUser) return;
      const personsRef = collection(db, `users/${auth.currentUser.uid}/persons`);
      const snapshot = await getDocs(personsRef);
      const personsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSavedPersons(personsList);
    };

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

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
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

  const scheduleNotification = (person, daysBefore) => {
    const birthday = new Date(person.birthday);
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
  };

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={savedPersons}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <PersonItem person={item} onAddReminder={handleAddReminder} />}
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
