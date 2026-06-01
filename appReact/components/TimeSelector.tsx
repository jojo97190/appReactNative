import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

interface TimeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectTime: (time: string) => void;
  selectedTime?: string;
  title?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  visible,
  onClose,
  onSelectTime,
  selectedTime = "",
  title = "Sélectionner l'heure"
}) => {
  // Heures autorisées: 7h à 17h (7-17)
  const hours = Array.from({ length: 11 }, (_, i) => i + 7); // 7, 8, 9, ..., 17
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 à 59

  // Parse selected time or use default
  const parsedTime = selectedTime.match(/^(\d{1,2}):(\d{2})$/);
  const [selectedHour, setSelectedHour] = useState<number>(
    parsedTime ? parseInt(parsedTime[1]) : 8
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    parsedTime ? parseInt(parsedTime[2]) : 0
  );

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  const ITEM_HEIGHT = 50;

  const handleConfirm = () => {
    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onSelectTime(formattedTime);
    onClose();
  };

  const renderHourItem = (hour: number) => {
    const isSelected = hour === selectedHour;
    return (
      <TouchableOpacity
        key={hour}
        style={[styles.timeItem, isSelected && styles.timeItemSelected]}
        onPress={() => setSelectedHour(hour)}
      >
        <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
          {hour.toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMinuteItem = (minute: number) => {
    const isSelected = minute === selectedMinute;
    return (
      <TouchableOpacity
        key={minute}
        style={[styles.timeItem, isSelected && styles.timeItemSelected]}
        onPress={() => setSelectedMinute(minute)}
      >
        <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
          {minute.toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          <View style={styles.timePickerContainer}>
            {/* Heures */}
            <View style={styles.scrollContainer}>
              <Text style={styles.scrollLabel}>Heure</Text>
              <ScrollView
                ref={hourScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.scrollPadding} />
                {hours.map(renderHourItem)}
                <View style={styles.scrollPadding} />
              </ScrollView>
            </View>

            <Text style={styles.separator}>:</Text>

            {/* Minutes */}
            <View style={styles.scrollContainer}>
              <Text style={styles.scrollLabel}>Minute</Text>
              <ScrollView
                ref={minuteScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.scrollPadding} />
                {minutes.map(renderMinuteItem)}
                <View style={styles.scrollPadding} />
              </ScrollView>
            </View>
          </View>

          {/* Preview */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Heure sélectionnée:</Text>
            <Text style={styles.previewTime}>
              {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: Dimensions.get('window').width - 48,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  scrollLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  scrollView: {
    height: 200,
    width: 80,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  scrollPadding: {
    height: 75,
  },
  timeItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
    marginHorizontal: 8,
  },
  timeItemSelected: {
    backgroundColor: '#6366f1',
  },
  timeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
  },
  timeTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  separator: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 16,
  },
  previewContainer: {
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  previewTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6366f1',
    letterSpacing: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  confirmButton: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default TimeSelector;
