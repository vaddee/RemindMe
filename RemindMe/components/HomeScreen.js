import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import HolidaysScreen from './HolidaysScreen';

export default function HomeScreen({ user }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const savePerson = async () => {
    if (name === '' || age === '') {
      Alert.alert('Virhe', 'Täytä sekä nimi että ikä.');
      return;
    }
  
    try {
      // Varmista että UID on olemassa
      if (!user?.uid) {
        Alert.alert('Virhe', 'Käyttäjä ei ole määritelty.');
        return;
      }
  
      console.log('Saving to Firestore for user:', user.uid);
  
      await addDoc(collection(db, `users/${user.uid}/persons`), {
        name: name,
        age: parseInt(age),
      });
      
      console.log('Document saved successfully');
      Alert.alert('Onnistui!', `Tallennettiin nimi: ${name}, ikä: ${age}`);
  
      setName('');
      setAge('');
    } catch (error) {
      console.log('Error saving document:', error);
      Alert.alert('Virhe', 'Tietojen tallentaminen epäonnistui: ' + error.message);
    }
  };
  

 

  return (
    <View style={{ padding: 16, marginTop: 100 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Syötä nimi ja ikä</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        placeholder="Syötä nimi"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        placeholder="Syötä ikä"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <Button title="Tallenna" onPress={savePerson} />
      
      <HolidaysScreen/>
    </View>
  );
}
