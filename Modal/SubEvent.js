import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, ScrollView, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Contact from './Contact'; // Assuming Contact is another component you have
import Round from './Round'; // Assuming Round is another component you have
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import uploadPDF from '../helper/uploadPDF'; // Assuming you have this helper for uploading PDFs

export default function SubEvent({ setEvent, event, closeModal }) {
  const [subEvents, setSubEvents] = useState(event.subEvents || []);
  const [currentSubEventId, setCurrentSubEventId] = useState(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [roundModalVisible, setRoundModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (subEvents.length === 0) {
      addNewSubEvent();
    } else {
      setCurrentSubEventId(subEvents[0].id);
    }
  }, []);

  const addNewSubEvent = () => {
    const newSubEvent = {
      id: `${Date.now()}-${Math.random()}`, // Unique ID for each sub-event
      subEventName: '',
      entryFee: '',
      description: '',
      date: new Date(),
      time: new Date(),
      venue: '',
      formUrl: '',
      rulebookPDF: { name: '', uri: '' },
      contacts: [],
      rounds: [],
    };
    setSubEvents((prevSubEvents) => [...prevSubEvents, newSubEvent]);
    setCurrentSubEventId(newSubEvent.id);
  };

  const deleteSubEvent = (id) => {
    Alert.alert(
      'Delete Sub Event',
      'Are you sure you want to delete this sub event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedSubEvents = subEvents.filter((subEvent) => subEvent.id !== id);
            setSubEvents(updatedSubEvents);
            setCurrentSubEventId(updatedSubEvents[0]?.id || null);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const updateSubEvent = (field, value) => {
    setSubEvents((prevSubEvents) =>
      prevSubEvents.map((subEvent) =>
        subEvent.id === currentSubEventId ? { ...subEvent, [field]: value } : subEvent
      )
    );
  };

  const pickRulebook = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled) {
      updateSubEvent('rulebookPDF', { name: result.name, uri: result.uri });
    }
  };

  const handleUpdateSubEvents = async () => {
    const updatedSubEvents = await Promise.all(
      subEvents.map(async (subEvent) => {
        let uploadedPDFUrl = null;
        if (subEvent.rulebookPDF.uri) {
          uploadedPDFUrl = await uploadPDF(subEvent.rulebookPDF.uri);
        }
        return {
          ...subEvent,
          rulebookPDF: uploadedPDFUrl ? { name: subEvent.rulebookPDF.name, uri: uploadedPDFUrl } : subEvent.rulebookPDF,
        };
      })
    );

    setEvent((prevEvent) => ({
      ...prevEvent,
      subEvents: updatedSubEvents,
    }));
    closeModal();
  };

  const renderSubEventItem = ({ item }) => (
    <View style={styles.subEventItemContainer}>
      <TouchableOpacity
        style={[styles.subEventItem, currentSubEventId === item.id && styles.selectedSubEvent]}
        onPress={() => setCurrentSubEventId(item.id)}
      >
        <Text style={styles.subEventItemText}>{item.subEventName || 'Unnamed Sub Event'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSubEvent(item.id)}>
        <Icon name="close-circle" size={24} color="#FF5722" />
      </TouchableOpacity>
    </View>
  );

  const currentSubEvent = subEvents.find((subEvent) => subEvent.id === currentSubEventId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sub Events</Text>

      <View style={styles.subEventList}>
        <FlatList
          data={subEvents}
          renderItem={renderSubEventItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNewSubEvent}>
          <Icon name="add-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        {currentSubEvent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Sub Event Name"
              value={currentSubEvent.subEventName}
              onChangeText={(text) => updateSubEvent('subEventName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Entry Fee"
              value={currentSubEvent.entryFee}
              onChangeText={(text) => updateSubEvent('entryFee', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={currentSubEvent.description}
              onChangeText={(text) => updateSubEvent('description', text)}
              multiline
            />
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar" size={24} color="#2196F3" />
              <Text style={styles.dateTimeText}>{currentSubEvent.date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={currentSubEvent.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) updateSubEvent('date', selectedDate);
                }}
              />
            )}
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
              <Icon name="time" size={24} color="#2196F3" />
              <Text style={styles.dateTimeText}>
                {currentSubEvent.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={currentSubEvent.time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) updateSubEvent('time', selectedTime);
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Venue"
              value={currentSubEvent.venue}
              onChangeText={(text) => updateSubEvent('venue', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Form URL"
              value={currentSubEvent.formUrl}
              onChangeText={(text) => updateSubEvent('formUrl', text)}
            />
            <TouchableOpacity style={styles.button} onPress={pickRulebook}>
              <Icon name="document" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Pick Rulebook PDF</Text>
            </TouchableOpacity>
            {currentSubEvent.rulebookPDF.name && (
              <Text style={styles.pdfName}>{currentSubEvent.rulebookPDF.name}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={() => setContactModalVisible(true)}>
              <Icon name="people" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Add Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setRoundModalVisible(true)}>
              <Icon name="trophy" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Add Rounds</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdateSubEvents}>
          <Text style={styles.buttonText}>Update Sub Events</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Modal */}
      <Modal visible={contactModalVisible} animationType="slide">
        <Contact closeModal={() => setContactModalVisible(false)} subEvent={currentSubEvent} updateSubEvent={updateSubEvent} />
      </Modal>

      {/* Round Modal */}
      <Modal visible={roundModalVisible} animationType="slide">
        <Round closeModal={() => setRoundModalVisible(false)} subEvent={currentSubEvent} updateSubEvent={updateSubEvent} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subEventList: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  subEventItem: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
  },
  selectedSubEvent: {
    backgroundColor: '#2196F3',
  },
  subEventItemText: {
    color: '#333',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateTimeText: {
    marginLeft: 10,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  pdfName: {
    marginBottom: 10,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF5722',
    flex: 1,
    marginRight: 5,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 5,
  },
  subEventItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 5,
  },
});