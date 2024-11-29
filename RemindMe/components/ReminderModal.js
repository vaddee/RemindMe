import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import modalStyles from '../styles/modalStyles';

export default function ReminderModal({
  visible,
  selectedPersonOrHoliday,
  daysBefore,
  setDaysBefore,
  onSave,
  onCancel,
  type,
}) {
  const displayName = selectedPersonOrHoliday
    ? type === 'birthday'
      ? selectedPersonOrHoliday.name
      : selectedPersonOrHoliday.name || selectedPersonOrHoliday.holidayName
    : '';

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>
            {type === 'birthday' ? 'Aseta syntymäpäivän muistutus' : 'Aseta juhlapäivän muistutus'}
          </Text>
          <Text style={modalStyles.modalText}>{displayName}</Text>
          <TextInput
            placeholder={type === 'birthday' ? 'Päivien määrä ennen syntymäpäivää' : 'Päivien määrä ennen juhlapäivää'}
            keyboardType="number-pad"
            value={daysBefore}
            onChangeText={setDaysBefore}
            style={modalStyles.input}
          />
          <TouchableOpacity onPress={onSave} style={modalStyles.button}>
            <Text style={modalStyles.buttonText}>Tallenna muistutus</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={[modalStyles.button, modalStyles.cancelButton]}>
            <Text style={modalStyles.buttonText}>Peruuta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
