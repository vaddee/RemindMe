// PersonItem.js
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function PersonItem({ person, onAddReminder }) {
  return (
    <View style={{ padding: 8, borderBottomWidth: 1 }}>
      <Text>Name: {person.name}</Text>
      <Text>Birthday: {person.birthday}</Text>
      <Button title="Lisää muistutus" onPress={() => onAddReminder(person)} />
    </View>
  );
}
