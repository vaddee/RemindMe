import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { generateGiftSuggestion } from '../services/openAiService';

export default function PersonItem({ person, onAddReminder, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleGenerateSuggestion = async () => {
    setLoading(true);
    try {
      const suggestion = await generateGiftSuggestion(person.intrest);
      Alert.alert('Lahjaidea', suggestion);
    } catch (error) {
      Alert.alert('Virhe', 'Lahjaidean generointi epäonnistui.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 8, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View>
        <Text>Name: {person.name}</Text>
        <Text>Birthday: {person.birthday}</Text>
        <Text>Intrest: {person.intrest}</Text>
        <Button title="Lisää muistutus" onPress={() => onAddReminder(person)} />
        <Button
          title={loading ? 'Ladataan...' : 'Ehdota lahjaidea'}
          onPress={handleGenerateSuggestion}
          disabled={loading}
        />
      </View>
      <TouchableOpacity onPress={() => onDelete(person)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}
