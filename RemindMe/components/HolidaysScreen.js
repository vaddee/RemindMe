import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { CALENDARIFIC_API_KEY } from '@env';

export default function HolidaysScreen() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

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
          </View>
        )}
      />
    </View>
  );
}
