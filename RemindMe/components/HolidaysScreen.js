import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CALENDARIFIC_API_KEY } from '@env';
import ReminderModal from './ReminderModal';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function HolidaysScreen() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [daysBefore, setDaysBefore] = useState('');

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(
          `https://calendarific.com/api/v2/holidays?&api_key=${CALENDARIFIC_API_KEY}&country=FI&year=2024`
        );
        const data = await response.json();
        setHolidays(data.response.holidays);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  const handleAddReminder = (holiday) => {
    setSelectedHoliday(holiday);
    setModalVisible(true);
  };

  const handleSaveReminder = async () => {
    if (!daysBefore || isNaN(daysBefore) || daysBefore <= 0) {
      alert('Syötä positiivinen luku päivien määräksi.');
      return;
    }

    try {
      const remindersRef = collection(db, `users/${auth.currentUser.uid}/holidayReminders`);
      await addDoc(remindersRef, {
        holidayName: selectedHoliday.name,
        holidayDate: selectedHoliday.date.iso,
        daysBefore: parseInt(daysBefore, 10),
        createdAt: new Date(),
      });

      Alert.alert('Muistutus tallennettu', `Muistutus ${selectedHoliday.name} -päivää varten lisätty.`);
      setModalVisible(false);
      setDaysBefore('');
    } catch (error) {
      console.error('Error saving holiday reminder:', error);
      alert('Muistutusta ei voitu tallentaa.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={holidays}
        keyExtractor={(item) => item.date.iso}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: '#888' }}>{item.date.iso}</Text>
            <TouchableOpacity
              onPress={() => handleAddReminder(item)}
              style={{ backgroundColor: 'blue', padding: 8, borderRadius: 5, marginTop: 8 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Lisää muistutus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <ReminderModal
        visible={modalVisible}
        selectedPersonOrHoliday={selectedHoliday}
        daysBefore={daysBefore}
        setDaysBefore={setDaysBefore}
        onSave={handleSaveReminder}
        onCancel={() => setModalVisible(false)}
        type="holiday"
      />
    </View>
  );
}
