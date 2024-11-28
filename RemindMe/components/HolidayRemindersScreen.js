import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

export default function HolidayRemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduledReminders, setScheduledReminders] = useState(new Set()); // Pidetään kirjaa ajoitetuista ilmoituksista

  // Haetaan muistutukset Firestoresta
  const fetchReminders = async () => {
    try {
      const remindersRef = collection(db, `users/${auth.currentUser.uid}/holidayReminders`);
      const snapshot = await getDocs(remindersRef);
      const reminderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReminders(reminderList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching holiday reminders:', error);
      setLoading(false);
    }
  };

  // Hakee tiedot, kun käyttäjä palaa näkymään
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchReminders();
    }, [])
  );

  // Asetetaan ilmoituksen käsittelijä
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  // Poistetaan muistutus Firestoresta ja tilasta
  const handleDeleteReminder = async (reminder) => {
    Alert.alert(
      "Poista muistutus",
      `Haluatko varmasti poistaa muistutuksen: ${reminder.holidayName}?`,
      [
        { text: "Peruuta" },
        {
          text: "Poista",
          onPress: async () => {
            try {
              const reminderRef = doc(db, `users/${auth.currentUser.uid}/holidayReminders/${reminder.id}`);
              await deleteDoc(reminderRef);
              Alert.alert("Muistutus poistettu!");

              setReminders((prevReminders) => prevReminders.filter((r) => r.id !== reminder.id));
              setScheduledReminders((prevScheduled) => {
                const updatedSet = new Set(prevScheduled);
                updatedSet.delete(reminder.id); // Poistetaan ajoitettu muistutus
                return updatedSet;
              });
            } catch (error) {
              console.error("Virhe muistutusta poistaessa:", error);
              Alert.alert("Virhe muistutusta poistaessa.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Ajastetaan ilmoitus (vain kerran jokaiselle muistutukselle)
  const scheduleNotification = async (reminder) => {
    if (scheduledReminders.has(reminder.id)) {
      console.log(`Reminder for ${reminder.holidayName} is already scheduled.`);
      return; // Jos ilmoitus on jo ajoitettu, ei tehdä mitään
    }

    // **Oikea tapa:**
    /*
    const holidayDate = new Date(reminder.holidayDate); // Muutetaan juhlapyhän päivämäärä Date-objektiksi
    const reminderDate = new Date(holidayDate);
    reminderDate.setDate(holidayDate.getDate() - reminder.daysBefore); // Asetetaan muistutus X päivää ennen

    const trigger = new Date(reminderDate);
    trigger.setHours(9, 0, 0); // Ilmoitus ajastetaan klo 9:00 aamulla

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Muistutus: ${reminder.holidayName}`,
        body: `Tämä päivä lähestyy! Valmistelut kannattaa aloittaa.`,
        sound: true,
      },
      trigger,
    });
    */

    // **Testaustapa: ilmoitus näkyy 10 sekunnin kuluttua**
    console.log(`Scheduling test notification for ${reminder.holidayName} in 10 seconds.`);
    const testTrigger = new Date(Date.now() + 10000); // 10 sekuntia nykyhetkestä

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Testi: ${reminder.holidayName}`,
        body: `Tämä on testimuistutus!`,
        sound: true,
      },
      trigger: testTrigger,
    });

    // Merkitään muistutus ajoitetuksi
    setScheduledReminders((prevScheduled) => new Set(prevScheduled).add(reminder.id));
  };

  // Tarkistetaan ja ajastetaan ilmoitukset
  useEffect(() => {
    reminders.forEach((reminder) => scheduleNotification(reminder));
  }, [reminders]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
            <Text style={{ fontSize: 18 }}>{item.holidayName}</Text>
            <Text style={{ color: '#888' }}>{item.holidayDate}</Text>
            <Text style={{ color: '#444' }}>Muistutus {item.daysBefore} päivää ennen</Text>
            <TouchableOpacity
              onPress={() => handleDeleteReminder(item)}
              style={{ backgroundColor: 'red', padding: 8, borderRadius: 5, marginTop: 8 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Poista muistutus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
