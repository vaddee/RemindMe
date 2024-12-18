import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CALENDARIFIC_API_KEY } from '@env';
import ReminderModal from './ReminderModal';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import buttonStyles from '../styles/buttonStyles'; 
import Toast from 'react-native-toast-message'; 
import CustomToast from '../styles/CustomToast'; 

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
      Toast.show({
        type: 'customToast',
        text1: 'Virhe',
        text2: 'Syötä positiivinen luku päivien määräksi.',
      });
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

      Toast.show({
        type: 'customToast',
        text1: 'Muistutus tallennettu',
        text2: `Muistutus ${selectedHoliday.name} -päivää varten lisätty.`,
      });

      setModalVisible(false);
      setDaysBefore('');
    } catch (error) {
      console.error('Error saving holiday reminder:', error);
      Toast.show({
        type: 'customToast',
        text1: 'Virhe',
        text2: 'Muistutusta ei voitu tallentaa.',
      });
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
              style={buttonStyles.button} // Käytä buttonStyles-tyyliä
            >
              <Text style={buttonStyles.buttonText}>Lisää muistutus</Text>
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
     
      <Toast config={{ customToast: (props) => <CustomToast {...props} /> }} />
    </View>
  );
}
