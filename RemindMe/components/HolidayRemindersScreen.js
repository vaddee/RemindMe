import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function HolidayRemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchReminders();
  }, []);

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
          </View>
        )}
      />
    </View>
  );
}
