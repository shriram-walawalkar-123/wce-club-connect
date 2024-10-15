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
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryApi from '../backendRoutes';
import uploadImage from '../helper/uploadImage'; // Function to upload image
import uploadPDF from '../helper/uploadPDF';

const AddEvent = () => {
  const navigation = useNavigation();
  const [formUrl, setFormUrl] = useState('');
  const [mainEvent, setMainEvent] = useState({
    clubName: '',
    eventName: '',
    eventPoster: null,
    description: '',
    eventDate: new Date(),
    sponsors: [],
  });

  const [pdfUri, setPdfUri] = useState(null);
  const [subEvents, setSubEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [newSubEvent, setNewSubEvent] = useState({
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(null);
  const [timePickerTarget, setTimePickerTarget] = useState('');

  // Function to open Google Form URL
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
      aspect: [4,3],
      quality: 1,  // Keep high quality
    });

    if (!result.canceled && result.assets?.[0].uri) {
      const selectedImageUri = result.assets[0].uri;
      const dataResponse = await uploadImage(selectedImageUri);
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
      const selectedImageUri = result.assets[0].uri;
      const dataResponse = await uploadImage(selectedImageUri);
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

  // const handleTimeChange = (event, selectedTime) => {
  //   const currentTime = selectedTime || new Date();
  //   setShowTimePicker(false);

  //   if (timePickerTarget === 'subEvent') {
  //     setNewSubEvent({ ...newSubEvent, time: currentTime });
  //   } else if (timePickerTarget.startsWith('round-')) {
  //     const roundIndex = parseInt(timePickerTarget.split('-')[1]);
  //     const updatedRounds = [...newSubEvent.rounds];
  //     updatedRounds[roundIndex].roundTime = currentTime;
  //     setNewSubEvent({ ...newSubEvent, rounds: updatedRounds });
  //   }
  // };
  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(false);
    console.log("timePickerTarget",timePickerTarget);
    if (timePickerTarget === 'subEvent') {
      setNewSubEvent({ ...newSubEvent, time: currentTime });
    } else if (timePickerTarget && timePickerTarget?.startsWith('round-')) {
      const parts = timePickerTarget?.split('-');
      if (parts.length >= 2) {
        const roundIndex = parseInt(parts[1], 10);
        if (!isNaN(roundIndex)) {
          const updatedRounds = [...newSubEvent.rounds];
          updatedRounds[roundIndex].roundTime = currentTime;
          setNewSubEvent({ ...newSubEvent, rounds: updatedRounds });
        }
      }
    } else {
      console.warn('Unexpected timePickerTarget:', timePickerTarget);
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
  };

  const handleAddSubEvent = () => {
    setSubEvents([...subEvents, newSubEvent]);
    setModalVisible(false);
    resetSubEventForm();
  };

  const resetSubEventForm = () => {
    setNewSubEvent({
      subEventName: '',
      entryFee: '',
      description: '',
      date: new Date(),
      time: new Date(),
      venue: '',
      contacts: [{ name: '', phone: '' }],
      rulebookPDF: [{ name: '', uri: '' }],
      rounds: [],
    });
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
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
  
      if (!result.canceled) {
        // console.log("Picked PDF URI: ", result.assets[0].uri);
        const uploadedPDF = await uploadPDF(result.assets[0].uri);
        // console.log(" hii subodh",uploadedPDF);
        if (uploadedPDF) {
          setNewSubEvent((prev) => ({
            ...prev,
            rulebookPDF: {
              name: result.assets[0].name, // Set the name of the PDF
              uri: uploadedPDF, // Set the URL of the uploaded PDF
            },
          }));
        }
        // console.log("Uploaded PDF Info: ", uploadedPDF);
      } else {
        console.log('User canceled document picking');
      }
    } catch (error) {
      console.error("Error picking or uploading PDF:", error);
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
    const eventDetails = { ...mainEvent, subEvents };
    // console.log('Event Created:', eventDetails);
    await AddEvent();

    navigation.navigate('UploadEventScreen');
  };

  const AddEvent = async () => {
    try {
      // Get the auth token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      // Combine mainEvent and subEvents into a single object
      // console.log("checking main event",mainEvent);
      const eventData = {
        ...mainEvent, // Assuming mainEvent is a state variable
        subEvents, // Assuming subEvents is a state variable
      };
      console.log('Rulebook PDF:', subEvents);
      // console.log("whole data",eventData);
      const response = await fetch(SummaryApi.club_event_add.url, {
        method: SummaryApi.club_event_add.method,
        headers: {
          'Content-Type': 'application/json', // Set content type
          'Authorization': `Bearer ${token}`, // Add the token to the headers
        },
        body: JSON.stringify(eventData), // Convert the combined object to JSON string
      });

      // Check if the response is okay (status in the range of 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response?.json();
      // console.log("data",data);
      // if (data.success) {
      //   setAllEvent(data.events);
      // }
    } catch (err) {
      console.error("Error fetching events in add event.js:", err);
    }
  };


  const openSubEventModal = (subEvent) => {
    setSelectedSubEvent(subEvent);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create a New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Club Name"
        value={mainEvent.clubName}
        onChangeText={(text) =>
          setMainEvent({ ...mainEvent, clubName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={mainEvent.eventName}
        onChangeText={(text) =>
          setMainEvent({ ...mainEvent, eventName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={mainEvent.description}
        onChangeText={(text) =>
          setMainEvent({ ...mainEvent, description: text })
        }
        multiline
      />
      <TouchableOpacity
        style={[styles.input, styles.datePicker]}
        onPress={() => showDatePickerModal('mainEvent')}
      >
        <Text>
          {mainEvent.eventDate.toDateString()}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickEventPoster} style={styles.imagePicker}>
        {mainEvent.eventPoster ? (
          <Image
            source={{ uri: mainEvent.eventPoster }}
            style={styles.image}
          />
        ) : (
          <Text>Select Event Poster</Text>
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
          <TouchableOpacity onPress={addSponsor} style={styles.imagePicker}>
            {sponsor.image ? (
              <Image source={{ uri: sponsor.image }} style={styles.image} />
            ) : (
              <Text>Select Sponsor Image</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button title="Add Sub Event" onPress={addSubEvent} />
        <Button title="Add Sponsor" onPress={addSponsor} />
        <Button title="Submit Event" onPress={handleSubmit} />
      </View>

      <View style={styles.subEventList}>
        <Text style={styles.subtitle}>Sub Events</Text>
        {subEvents.map((subEvent, index) => (
          <View key={index} style={styles.subEventContainer}>
            <Text style={styles.subEventTitle}>{subEvent.subEventName}</Text>
            <Text>{`Entry Fee: ${subEvent.entryFee}`}</Text>
            <Text>{`Description: ${subEvent.description}`}</Text>
            <Text>{`Date: ${subEvent.date.toDateString()}`}</Text>
            <Text>{`Time: ${subEvent.time.toLocaleTimeString()}`}</Text>
            <Text>{`Venue: ${subEvent.venue}`}</Text>
          </View>
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
                {selectedSubEvent ? 'Edit Sub Event' : 'Add Sub Event'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Sub Event Name"
                value={newSubEvent.subEventName}
                onChangeText={(text) =>
                  setNewSubEvent({ ...newSubEvent, subEventName: text })
                }
              />
              <View style={styles.container}>

                <TextInput
                  style={styles.input}
                  placeholder="Enter Google Form URL"
                  value={formUrl}
                  onChangeText={setFormUrl}
                />

                {/* Button to register for the event */}
                <TouchableOpacity style={styles.button} onPress={openGoogleForm}>
                  <Text style={styles.buttonText}>Register for the Event</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Entry Fee"
                value={newSubEvent.entryFee}
                onChangeText={(text) =>
                  setNewSubEvent({ ...newSubEvent, entryFee: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Sub Event Description"
                value={newSubEvent.description}
                onChangeText={(text) =>
                  setNewSubEvent({ ...newSubEvent, description: text })
                }
                multiline
              />
              <TouchableOpacity
                style={[styles.input, styles.datePicker]}
                onPress={() => showDatePickerModal('subEvent')}
              >
                <Text>
                  {newSubEvent.date.toDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input, styles.timePicker]}
                onPress={() => showTimePickerModal('subEvent')}
              >
                <Text>
                  {newSubEvent.time.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Venue"
                value={newSubEvent.venue}
                onChangeText={(text) =>
                  setNewSubEvent({ ...newSubEvent, venue: text })
                }
              />

              <View style={styles.pdfName}>
                <Button title="Upload Rulebook PDF" onPress={pickRulebookPDF} />
                {newSubEvent.rulebookPDF ? (
                  <View>
                    <Text style={styles.pdfName}>{newSubEvent.rulebookPDF.name}</Text>
                    <Button
                      title="Open Rulebook PDF"
                      onPress={() => openPDF(newSubEvent.rulebookPDF.uri)} // Call the openPDF function with the PDF URI
                    />
                  </View>
                ) : (
                  <Text style={styles.pdfName}>No PDF uploaded</Text>
                )}

              </View>

              {/* add google form link */}

              {newSubEvent.contacts.map((contact, index) => (
                <View key={index} style={styles.contactContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Name"
                    value={contact.name}
                    onChangeText={(text) =>
                      updateSubEventContact(index, 'name', text)
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Phone"
                    value={contact.phone}
                    onChangeText={(text) =>
                      updateSubEventContact(index, 'phone', text)
                    }
                  />
                </View>
              ))}

              <Button title="Add Contact" onPress={addSubEventContact} />
              {newSubEvent.rounds.map((round, roundIndex) => (
                <View key={roundIndex} style={styles.roundContainer}>
                  <Text style={styles.roundTitle}>Round {roundIndex + 1}</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.timePicker]}
                    onPress={() => showTimePickerModal(round - `${roundIndex}`)}
                  >
                    <Text>
                      {round.roundTime.toLocaleTimeString()}
                    </Text>
                  </TouchableOpacity>
                  {round.description.map((desc, descIndex) => (
                    <TextInput
                      key={descIndex}
                      style={styles.input}
                      placeholder={`Description Point ${descIndex + 1}`}
                      value={desc}
                      onChangeText={(text) => updateRoundDescription(roundIndex, descIndex, text)}
                    />

                  ))
                  }

                  <Button
                    title="Add Description Point"
                    onPress={() => addRoundDescriptionPoint(roundIndex)}
                  />

                </View>

              )
              )
              }
              <Button title="Add Round" onPress={addRound} />
              <Button title="Save Sub Event" onPress={handleAddSubEvent} />
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
      )
      }

      {showTimePicker && (
        <DateTimePicker
          value={
            timePickerTarget === 'subEvent'
              ? newSubEvent.time
              : newSubEvent.rounds[parseInt(timePickerTarget.split('-'))].roundTime
          }
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
    padding: 16,
  },
  pdfName: {
    fontSize: 14,
    color: 'gray',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  timePicker: {
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  imagePicker: {
    // width: screenWidth,       // Full screen width
    // aspectRatio: 16 / 3,      // Aspect ratio of 16:3
    // resizeMode: 'cover',
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  datePicker: {
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
  },
  sponsorContainer: {
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  scrollView: {
    paddingBottom: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roundContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  subEventList: {
    marginVertical: 20,
  },
  subEventContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  subEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default AddEvent;