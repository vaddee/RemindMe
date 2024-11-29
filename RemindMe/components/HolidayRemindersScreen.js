import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';

export default function HolidayRemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Ajastetaan ilmoitus (vain kerran)
  const scheduleNotification = async (reminder) => {
    if (reminder.isScheduled) {
      console.log(`Notification for ${reminder.holidayName} is already scheduled.`);
      return; // Jos ilmoitus on jo ajastettu, ei tehdä mitään
    }

    // **Oikea tapa:**
    /*
    const holidayDate = new Date(reminder.holidayDate); // Muutetaan juhlapyhän päivämäärä Date-objektiksi
    const reminderDate = new Date(holidayDate);
    reminderDate.setDate(reminderDate.getDate() - reminder.daysBefore); // Asetetaan muistutus X päivää ennen
    reminderDate.setHours(9, 0, 0); // Ajastetaan muistutus klo 9:00 aamulla
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Muistutus: ${reminder.holidayName}`,
        body: `Tämä päivä lähestyy! Valmistelut kannattaa aloittaa.`,
        sound: true,
      },
      trigger: reminderDate,
    });
    */

    // **Testaustapa: ilmoitus 10 sekunnin kuluttua**
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

    // Päivitetään Firestoreen, että muistutus on ajastettu
    const reminderRef = doc(db, `users/${auth.currentUser.uid}/holidayReminders/${reminder.id}`);
    await updateDoc(reminderRef, { isScheduled: true });

    console.log(`Notification scheduled successfully for ${reminder.holidayName}`);
  };

  // Tarkistetaan ja ajastetaan ilmoitukset vain kerran
  useEffect(() => {
    reminders.forEach((reminder) => {
      scheduleNotification(reminder);
    });
  }, [reminders]);

  // Poistetaan muistutus Firestoresta ja tilasta
  const handleDeleteReminder = async (reminder) => {
    Alert.alert(
      'Poista muistutus',
      `Haluatko varmasti poistaa muistutuksen: ${reminder.holidayName}?`,
      [
        { text: 'Peruuta' },
        {
          text: 'Poista',
          onPress: async () => {
            try {
              const reminderRef = doc(db, `users/${auth.currentUser.uid}/holidayReminders/${reminder.id}`);
              await deleteDoc(reminderRef);
              setReminders((prevReminders) => prevReminders.filter((r) => r.id !== reminder.id));
              Alert.alert('Muistutus poistettu!');
            } catch (error) {
              console.error('Virhe muistutusta poistaessa:', error);
              Alert.alert('Virhe muistutusta poistaessa.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Hakee tiedot, kun käyttäjä palaa näkymään
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchReminders();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 8,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18 }}>{item.holidayName}</Text>
              <Text style={{ color: '#888' }}>{item.holidayDate}</Text>
              <Text style={{ color: '#444' }}>Muistutus {item.daysBefore} päivää ennen</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteReminder(item)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 12,
              }}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
