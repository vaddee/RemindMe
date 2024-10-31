// ReminderModal.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

export default function ReminderModal({ visible, selectedPerson, daysBefore, setDaysBefore, onSave, onCancel }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Aseta muistutuksen aika</Text>
          <Text>{selectedPerson ? selectedPerson.name : ''}</Text>
          <TextInput
            placeholder="Päivien määrä ennen syntymäpäivää"
            keyboardType="number-pad"
            value={daysBefore}
            onChangeText={setDaysBefore}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              marginVertical: 10,
              borderRadius: 5,
            }}
          />
          <TouchableOpacity onPress={onSave} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginBottom: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Tallenna muistutus</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Peruuta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
