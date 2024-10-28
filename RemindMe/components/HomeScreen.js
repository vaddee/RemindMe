import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import HolidaysScreen from './HolidaysScreen';

export default function HomeScreen({ user }) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
      Alert.alert('Virhe', 'Täytä sekä nimi että syntymäpäivä.');
      return;
    }

    try {
      if (!user?.uid) {
        Alert.alert('Virhe', 'Käyttäjä ei ole määritelty.');
        return;
      }

      await addDoc(collection(db, `users/${user.uid}/persons`), {
        name: name,
        birthday: birthday,
      });

      Alert.alert('Onnistui!', `Tallennettiin nimi: ${name}, syntymäpäivä: ${birthday}`);
      setName('');
      setBirthday('');
    } catch (error) {
      console.log('Error saving document:', error);
      Alert.alert('Virhe', 'Tietojen tallentaminen epäonnistui: ' + error.message);
    }
  };

  return (
    <View style={{ padding: 16, marginTop: 100 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Syötä nimi ja syntymäpäivä</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        placeholder="Syötä nimi"
        value={name}
        onChangeText={setName}
      />
      
      <Button title="Valitse syntymäpäivä" onPress={showDatePicker} />
      {birthday && <Text style={{ marginVertical: 8 }}>Syntymäpäivä: {birthday}</Text>}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Button title="Tallenna" onPress={savePerson} />
      
      
    </View>
  );
}
