import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { generateGiftSuggestion } from '../services/openAiService';
import modalStyles from '../styles/modalStyles';
import buttonStyles from '../styles/buttonStyles'; 
import textStyles from '../styles/textStyles'; 

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
        <Text style={textStyles.header}>Nimi: {person.name}</Text>
        <Text style={textStyles.subHeader}>Syntymäpäivä: {person.birthday}</Text>
        <Text style={textStyles.bodyText}>Kiinnostuksen kohde: {person.intrest}</Text>

        
        <TouchableOpacity style={buttonStyles.button} onPress={() => onAddReminder(person)}>
          <Text style={buttonStyles.buttonText}>Lisää muistutus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[buttonStyles.button, loading && { backgroundColor: '#B0C4DE' }]} 
          onPress={handleGenerateSuggestion}
          disabled={loading}
        >
          <Text style={buttonStyles.buttonText}>{loading ? 'Ladataan...' : 'Ehdota lahjaidea'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => onDelete(person)}>
        <MaterialIcons name="delete" size={32} color="red" /> 
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

      {/* Painikkeet */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
  {/* Generoi uusi idea -ikoni */}
  <TouchableOpacity
    onPress={handleGenerateSuggestion}
    style={[modalStyles.smallButton, { padding: 10 }, loading && { backgroundColor: '#B0C4DE' }]} // Pienempi täyte
    disabled={loading}
  >
    <MaterialIcons name="refresh" size={24} color="#90EE90" />
  </TouchableOpacity>

  {/* Sulje-painike */}
  <TouchableOpacity
    onPress={() => setModalVisible(false)}
    style={modalStyles.smallButton}
  >
    <Text style={modalStyles.smallButtonText}>Sulje</Text>
  </TouchableOpacity>
</View>


    </View>
  </View>
</Modal>

    </View>
  );
}
