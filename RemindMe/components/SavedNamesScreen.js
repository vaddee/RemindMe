import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function SavedNamesScreen() {
  const [savedPersons, setSavedPersons] = useState([]);

  useEffect(() => {
    const fetchPersons = async () => {
      if (!auth.currentUser) return;
      const personsRef = collection(db, `users/${auth.currentUser.uid}/persons`);
      const snapshot = await getDocs(personsRef);
      const personsList = snapshot.docs.map(doc => doc.data());
      setSavedPersons(personsList);
    };

    fetchPersons();
  }, []);

  const handleAddReminder = (person) => {
    //t'nne logiikka
    console.log(`Adding reminder for ${person.name}`)
  }

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={savedPersons}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>Name: {item.name}</Text>
            <Text>Birhday: {item.birthday}</Text>
            <Button
            title='lisaa muistutus'
            onPress={() => handleAddReminder(item)}/>
            
          </View>
        )}
      />
    </View>
  );
}
