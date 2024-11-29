import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { generateGiftSuggestion } from '../services/openAiService';
import modalStyles from '../styles/modalStyles';

export default function PersonItem({ person, onAddReminder, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleGenerateSuggestion = async () => {
    setLoading(true);
    try {
      const result = await generateGiftSuggestion(person.intrest);
      setSuggestion(result);
      setModalVisible(true);
    } catch (error) {
      setSuggestion('Lahjaidean generointi epäonnistui.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 8, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
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

      {/* Modaali lahjaidealle */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>Lahjaidea</Text>
            <Text style={modalStyles.modalText}>{suggestion}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.button}>
              <Text style={modalStyles.buttonText}>Sulje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
