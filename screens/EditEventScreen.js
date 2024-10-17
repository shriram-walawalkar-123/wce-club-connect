import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Linking
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryApi from '../backendRoutes';

const EditEvent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const eventToEdit = route.params?.event || {};
  // console.log("eventEdit data", eventToEdit);
  const [formUrl, setFormUrl] = useState(eventToEdit.formUrl || '');

  const [mainEvent, setMainEvent] = useState({
    eventId: eventToEdit._id,
    clubName: eventToEdit.clubName || '',
    eventName: eventToEdit.eventName || '',
    eventPoster: eventToEdit.eventPoster || null,
    description: eventToEdit.description || '',
    eventDate: eventToEdit.eventDate ? new Date(eventToEdit.eventDate) : new Date(),
    sponsors: eventToEdit.sponsors || [],
  });

  const [subEvents, setSubEvents] = useState(eventToEdit.subEvents || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [newSubEvent, setNewSubEvent] = useState({
    subEventName: '',
    entryFee: eventToEdit.entryFee || '',
    description: '',
    date: new Date(),
    time: new Date(),
    venue: '',
    contacts: [{ name: '', phone: '' }],
    rulebookPDF: { name: '', uri: '' },
    rounds: eventToEdit.rounds || [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(null);
  const [timePickerTarget, setTimePickerTarget] = useState(null);

  const openGoogleForm = () => {
    if (formUrl) {
      Linking.openURL(formUrl).catch((err) => console.error('Failed to open URL:', err));
    } else {
      alert('Please enter a valid URL');
    }
  };

  const pickEventPoster = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0].uri) {
      setMainEvent({ ...mainEvent, eventPoster: result.assets[0].uri });
    }
  };

  const addSponsor = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0].uri) {
      setMainEvent({
        ...mainEvent,
        sponsors: [
          ...mainEvent.sponsors,
          { sponsorType: '', image: result.assets[0].uri },
        ],
      });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (datePickerTarget === 'mainEvent' ? mainEvent.eventDate : newSubEvent.date);
    setShowDatePicker(false);
    if (datePickerTarget === 'mainEvent') {
      setMainEvent({ ...mainEvent, eventDate: currentDate });
    } else if (datePickerTarget === 'subEvent') {
      setNewSubEvent({ ...newSubEvent, date: currentDate });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(false);

    if (timePickerTarget === 'subEvent') {
      setNewSubEvent({ ...newSubEvent, time: currentTime });
    } else if (timePickerTarget.startsWith('round-')) {
      const roundIndex = parseInt(timePickerTarget.split('-')[1]);
      const updatedRounds = [...newSubEvent.rounds];
      updatedRounds[roundIndex].roundTime = currentTime;
      setNewSubEvent({ ...newSubEvent, rounds: updatedRounds });
    }
  };

  const showDatePickerModal = (target) => {
    setDatePickerTarget(target);
    setShowDatePicker(true);
  };

  const showTimePickerModal = (target) => {
    setTimePickerTarget(target);
    setShowTimePicker(true);
  };

  const updateSponsor = (index, key, value) => {
    const newSponsors = [...mainEvent.sponsors];
    newSponsors[index][key] = value;
    setMainEvent({ ...mainEvent, sponsors: newSponsors });
  };

  const addSubEvent = () => {
    setModalVisible(true);
    setSelectedSubEvent(null);
    setNewSubEvent({
      subEventName: '',
      entryFee: '',
      description: '',
      date: new Date(),
      time: new Date(),
      venue: '',
      contacts: [{ name: '', phone: '' }],
      rulebookPDF: { name: '', uri: '' },
      rounds: [],
    });
  };

  const handleAddSubEvent = () => {
    if (selectedSubEvent !== null) {
      const updatedSubEvents = [...subEvents];
      updatedSubEvents[selectedSubEvent] = newSubEvent;
      setSubEvents(updatedSubEvents);
    } else {
      setSubEvents([...subEvents, newSubEvent]);
    }
    setModalVisible(false);
  };

  const updateSubEventContact = (contactIndex, key, value) => {
    const updatedContacts = [...newSubEvent.contacts];
    updatedContacts[contactIndex][key] = value;
    setNewSubEvent({ ...newSubEvent, contacts: updatedContacts });
  };

  const addSubEventContact = () => {
    setNewSubEvent({
      ...newSubEvent,
      contacts: [...newSubEvent.contacts, { name: '', phone: '' }],
    });
  };

  const pickRulebookPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });

    if (!result.canceled) {
      setNewSubEvent({
        ...newSubEvent,
        rulebookPDF: {
          uri: result.uri, // Access directly from the result object
          name: result.name, // Access directly from the result object
        },
      });
    }
  };


  const addRound = () => {
    setNewSubEvent({
      ...newSubEvent,
      rounds: [...newSubEvent.rounds, { roundTime: new Date(), description: [''] }],
    });
  };

  const updateRound = (roundIndex, key, value) => {
    const updatedRounds = [...newSubEvent.rounds];
    updatedRounds[roundIndex][key] = value;
    setNewSubEvent({ ...newSubEvent, rounds: updatedRounds });
  };

  const addRoundDescriptionPoint = (roundIndex) => {
    const updatedRounds = [...newSubEvent.rounds];
    updatedRounds[roundIndex].description.push('');
    setNewSubEvent({ ...newSubEvent, rounds: updatedRounds });
  };

  const updateRoundDescription = (roundIndex, descIndex, value) => {
    const updatedRounds = [...newSubEvent.rounds];
    updatedRounds[roundIndex].description[descIndex] = value;
    setNewSubEvent({ ...newSubEvent, rounds: updatedRounds });
  };

  const handleSubmit = async () => {
    const eventDetails = {
      ...mainEvent,
      subEvents
    };
    await updateEvent(eventDetails);
    navigation.goBack();
  };

  const updateEvent = async (eventDetails) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(SummaryApi.club_event_edit.url, {
        method: SummaryApi.club_event_edit.method,
        headers: {
          'Content-Type': 'application/json', // Set content type
          'Authorization': `Bearer ${token}`, // Add the token to the headers
        },
        body: JSON.stringify(eventDetails), // Convert the combined object to JSON string
      });
      const data = await response?.json();
      // console.log("data", data);
      // if (data.success) {
      //   setAllEvent(data.events);
      // }
    } catch (err) {
      console.error("Error fetching events in edit event.js:", err);
    }
  };

  const openSubEventModal = (index) => {
    setSelectedSubEvent(index);
    setNewSubEvent(subEvents[index]);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Club Name"
        value={mainEvent.clubName}
        onChangeText={(text) => setMainEvent({ ...mainEvent, clubName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={mainEvent.eventName}
        onChangeText={(text) => setMainEvent({ ...mainEvent, eventName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={mainEvent.description}
        onChangeText={(text) => setMainEvent({ ...mainEvent, description: text })}
        multiline
      />
      <TouchableOpacity
        style={[styles.input, styles.datePicker]}
        onPress={() => showDatePickerModal('mainEvent')}
      >
        <Text style={styles.dateText}>{mainEvent.eventDate.toDateString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickEventPoster} style={styles.imagePicker}>
        {mainEvent.eventPoster ? (
          <Image source={{ uri: mainEvent.eventPoster }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Event Poster</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.subtitle}>Sponsors</Text>
      {mainEvent.sponsors.map((sponsor, index) => (
        <View key={index} style={styles.sponsorContainer}>
          <TextInput
            style={styles.input}
            placeholder="Sponsor Type"
            value={sponsor.sponsorType}
            onChangeText={(text) => updateSponsor(index, 'sponsorType', text)}
          />
          <TouchableOpacity onPress={() => addSponsor()} style={styles.imagePicker}>
            {sponsor.image ? (
              <Image source={{ uri: sponsor.image }} style={styles.image} />
            ) : (
              <Text style={styles.imagePickerText}>Select Sponsor Image</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Enter Google Form URL"
        value={formUrl}
        onChangeText={setFormUrl}
      />

      <TouchableOpacity style={styles.button} onPress={openGoogleForm}>
        <Text style={styles.buttonText}>Open Registration Form</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={addSubEvent}>
          <Text style={styles.secondaryButtonText}>Add Sub Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={addSponsor}>
          <Text style={styles.secondaryButtonText}>Add Sponsor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Update Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subEventList}>
        <Text style={styles.subtitle}>Sub Events</Text>
        {subEvents.map((subEvent, index) => (
          <TouchableOpacity key={index} onPress={() => openSubEventModal(index)}>
            <View style={styles.subEventContainer}>
              <Text style={styles.subEventTitle}>{subEvent.subEventName}</Text>
              <Text>{`Entry Fee: ${subEvent.entryFee}`}</Text>
              <Text>{`Description: ${subEvent.description}`}</Text>
              <Text>{`Date: ${new Date(subEvent.date).toDateString()}`}</Text>
              <Text>{`Time: ${new Date(subEvent.time).toLocaleTimeString()}`}</Text>
              <Text>{`Venue: ${subEvent.venue}`}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <Text style={styles.modalTitle}>
                {selectedSubEvent !== null ? 'Edit Sub Event' : 'Add Sub Event'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Sub Event Name"
                value={newSubEvent.subEventName}
                onChangeText={(text) => setNewSubEvent({ ...newSubEvent, subEventName: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Entry Fee"
                value={newSubEvent.entryFee}
                onChangeText={(text) => setNewSubEvent({ ...newSubEvent, entryFee: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Sub Event Description"
                value={newSubEvent.description}
                onChangeText={(text) => setNewSubEvent({ ...newSubEvent, description: text })}
                multiline
              />
              <TouchableOpacity
                style={[styles.input, styles.datePicker]}
                onPress={() => showDatePickerModal('subEvent')}
              >
                <Text style={styles.dateText}>{new Date(newSubEvent.date).toDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input, styles.timePicker]}
                onPress={() => showTimePickerModal('subEvent')}
              >
                <Text style={styles.dateText}>{new Date(newSubEvent.time).toLocaleTimeString()}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Venue"
                value={newSubEvent.venue}
                onChangeText={(text) => setNewSubEvent({ ...newSubEvent, venue: text })}
              />

              <View style={styles.pdfContainer}>
                <TouchableOpacity style={styles.button} onPress={pickRulebookPDF}>
                  <Text style={styles.buttonText}>Upload Rulebook PDF</Text>
                </TouchableOpacity>
                {newSubEvent.rulebookPDF && newSubEvent.rulebookPDF.name && (
                  <Text style={styles.pdfName}>{newSubEvent.rulebookPDF.name}</Text>
                )}
              </View>

              {newSubEvent.contacts.map((contact, index) => (
                <View key={index} style={styles.contactContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Name"
                    value={contact.name}
                    onChangeText={(text) => updateSubEventContact(index, 'name', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Phone"
                    value={contact.phone}
                    onChangeText={(text) => updateSubEventContact(index, 'phone', text)}
                    keyboardType="phone-pad"
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.button} onPress={addSubEventContact}>
                <Text style={styles.buttonText}>Add Contact</Text>
              </TouchableOpacity>

              <Text style={styles.subtitle}>Rounds</Text>
              {newSubEvent.rounds.map((round, roundIndex) => (
                <View key={roundIndex} style={styles.roundContainer}>
                  <TouchableOpacity
                    style={[styles.input, styles.timePicker]}
                    onPress={() => showTimePickerModal(`round-${roundIndex}`)}
                  >
                    <Text style={styles.dateText}>{new Date(round.roundTime).toLocaleTimeString()}</Text>
                  </TouchableOpacity>
                  {round.description.map((desc, descIndex) => (
                    <TextInput
                      key={descIndex}
                      style={styles.input}
                      placeholder={`Round ${roundIndex + 1} Description ${descIndex + 1}`}
                      value={desc}
                      onChangeText={(text) => updateRoundDescription(roundIndex, descIndex, text)}
                      multiline
                    />
                  ))}
                  <TouchableOpacity style={styles.button} onPress={() => addRoundDescriptionPoint(roundIndex)}>
                    <Text style={styles.buttonText}>Add Description Point</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.button} onPress={addRound}>
                <Text style={styles.buttonText}>Add Round</Text>
              </TouchableOpacity>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleAddSubEvent}>
                  <Text style={styles.primaryButtonText}>Save Sub Event</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={datePickerTarget === 'mainEvent' ? mainEvent.eventDate : newSubEvent.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={timePickerTarget === 'subEvent' ? newSubEvent.time : newSubEvent.rounds[parseInt(timePickerTarget.split('-')[1])].roundTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2980b9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#ecf0f1',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sponsorContainer: {
    marginBottom: 10,
  },
  subEventList: {
    marginTop: 20,
  },
  subEventContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  subEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2980b9',
  },
  scrollView: {
    flexGrow: 1,
  },
  pdfContainer: {
    marginBottom: 10,
  },
  pdfName: {
    marginTop: 5,
    color: '#7f8c8d',
  },
  contactContainer: {
    marginBottom: 10,
  },
  roundContainer: {
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  datePicker: {
    justifyContent: 'center',
  },
  timePicker: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#34495e',
  },
  imagePickerText: {
    color: '#2980b9',
    fontSize: 16,
  },
});

export default EditEvent;