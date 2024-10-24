// components/LogoutScreen.js
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LogoutScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Kirjauduit ulos!');
      navigation.navigate('Auth'); // Navigoi kirjautumissivulle uloskirjautumisen jälkeen
    } catch (error) {
      Alert.alert('Virhe', error.message);
    }
  };

  return (
    <View style={{ padding: 16, marginTop: 100 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Kirjaudu ulos</Text>
      <Button title="Kirjaudu ulos" onPress={handleLogout} />
    </View>
  );
}
