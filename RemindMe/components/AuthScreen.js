import React, { useState } from 'react';
import { TextInput, Button, View, Alert, Text } from 'react-native';
import { auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(true);

  const handleAuth = async () => {
    try {
      if (isSigningIn) {
        // Kirjaudu sisään
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Onnistui', 'Kirjauduit sisään!');
      } else {
        // Luo uusi käyttäjä
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Onnistui', 'Käyttäjä luotu ja kirjattu sisään!');
      }
    } catch (error) {
      Alert.alert('Virhe', error.message);
    }
  };

  return (
    <View style={{ padding: 16 , marginTop: 100}}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>{isSigningIn ? 'Kirjaudu sisään' : 'Luo tili'}</Text>
      <TextInput
        placeholder="Sähköposti"
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Salasana"
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isSigningIn ? 'Kirjaudu sisään' : 'Rekisteröidy'} onPress={handleAuth} />
      <Text
        style={{ marginTop: 16, textAlign: 'center', color: 'blue' }}
        onPress={() => setIsSigningIn(!isSigningIn)}
      >
        {isSigningIn ? 'Luo uusi tili' : 'Kirjaudu sisään'}
      </Text>
    </View>
  );
}