// PersonItem.js
import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // tuo MaterialIcons

export default function PersonItem({ person, onAddReminder, onDelete }) {
  return (
    <View style={{ padding: 8, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View>
        <Text>Name: {person.name}</Text>
        <Text>Birthday: {person.birthday}</Text>
        <Button title="Lisää muistutus" onPress={() => onAddReminder(person)} />
      </View>
      <TouchableOpacity onPress={() => onDelete(person)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}
