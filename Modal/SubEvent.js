import { StyleSheet, Text, View, TextInput, Button, Modal, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Contact from './Contact';
import Round from './Round';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import uploadPDF from '../helper/uploadPDF'; // Adjust the import path as necessary
import uploadImage from '../helper/uploadImage'; // Import the uploadImage function

export default function SubEvent({ setEvent, event, closeModal }) {
  const [subEventName, setSubEventName] = useState(event.subEvents[0].subEventName);
  const [entryFee, setEntryFee] = useState(event.subEvents[0].entryFee);
  const [description, setDescription] = useState(event.subEvents[0].description);
  const [date, setDate] = useState(event.subEvents[0].date || new Date());
  const [time, setTime] = useState(event.subEvents[0].time || new Date());
  const [venue, setVenue] = useState(event.subEvents[0].venue);
  const [formUrl, setFormUrl] = useState(event.subEvents[0].formUrl);
  const [rulebookPDF, setRulebookPDF] = useState({ name: '', uri: '' }); // PDF state
   
  // Modal state for Contact and Round
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [roundModalVisible, setRoundModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [contacts, setContacts] = useState(event.subEvents[0].contacts || []);
  const [rounds, setRounds] = useState(event.subEvents[0].rounds || []);

  // Function to pick a PDF document for the rulebook
  const pickRulebook = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
    if (!result.canceled) {
      // Log the selected document info before updating the state
      console.log("Selected PDF:", result.assets[0]);
      
      setRulebookPDF({ name: result.assets[0].name, uri: result.assets[0].uri });
      
      // Log the PDF state after it's been set
      console.log("Updated PDF State:", { name: result.assets[0].name, uri: result.assets[0].uri });
    }
  };

  // Effect to log when PDF state updates
  useEffect(() => {
    console.log("PDF State Updated:", rulebookPDF);
  }, [rulebookPDF]);

  const handleUpdateSubEvent = async () => {
    // Upload rulebook rulebookPDF if a file has been selected
    let uploadedPDFUrl = null;
    if (rulebookPDF.uri) {
      uploadedPDFUrl = await uploadPDF(rulebookPDF.uri);
      console.log("Uploaded PDF URL:", uploadedPDFUrl);
    }

    // Update the event with the new sub-event details
    setEvent(prevEvent => ({
      ...prevEvent,
      subEvents: [
        {
          subEventName,
          entryFee,
          description,
          date,
          time,
          venue,
          formUrl,
          rulebookPDF: rulebookPDF,
          contacts,
          rounds,
        },
      ],
    }));
    closeModal(); // Close modal after updating
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time; // Use the selected time or the existing time
    setShowTimePicker(false); // Hide the picker after selection
    setTime(currentTime); // Update the time state
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date; // Use the selected date or the existing date
    setShowDatePicker(false); // Hide the picker after selection
    setDate(currentDate); // Update the date state
  };

  return (
    <View>
      <Text>Sub Event</Text>

      {/* Sub Event Name */}
      <TextInput
        placeholder="Sub Event Name"
        value={subEventName}
        onChangeText={setSubEventName}
      />

      {/* Entry Fee */}
      <TextInput
        placeholder="Entry Fee"
        value={entryFee}
        onChangeText={setEntryFee}
        keyboardType="numeric"
      />

      {/* Description */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Date Picker */}
      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()} // Use the selected date or current date
          mode="date" // Set mode to "date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {date && (
        <Text>Selected Date: {date.toLocaleDateString()}</Text>
      )}

      {/* Time Picker */}
      <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()} // Use the selected time or current time
          mode="time" // Set mode to "time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      {time && (
        <Text>Selected Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      )}

      {/* Venue */}
      <TextInput
        placeholder="Venue"
        value={venue}
        onChangeText={setVenue}
      />

      {/* Form URL */}
      <TextInput
        placeholder="Form URL"
        value={formUrl}
        onChangeText={setFormUrl}
      />

      {/* Rulebook PDF Picker */}
      <Button title="Pick Rulebook PDF" onPress={pickRulebook} />
      {rulebookPDF.name ? <Text>Selected rulebookPDF: {rulebookPDF.name}</Text> : null}

      {/* Open Contact Modal */}
      <Button title="Add Contacts" onPress={() => setContactModalVisible(true)} />
      <Modal
        visible={contactModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <Contact
          setContacts={setContacts}
          contacts={contacts}
          closeModal={() => setContactModalVisible(false)}
        />
      </Modal>

      {/* Open Round Modal */}
      <Button title="Add Rounds" onPress={() => setRoundModalVisible(true)} />
      <Modal
        visible={roundModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setRoundModalVisible(false)}
      >
        <Round
          setRounds={setRounds}
          rounds={rounds}
          closeModal={() => setRoundModalVisible(false)}
        />
      </Modal>

      {/* Update Button */}
      <Button title="Update Sub Event" onPress={handleUpdateSubEvent} />
      <Button title="Close" onPress={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({});
