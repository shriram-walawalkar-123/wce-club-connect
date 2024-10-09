import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';

const AddEvent = () => {
  const navigation = useNavigation();
  const [mainEvent, setMainEvent] = useState({
    clubName: '',
    eventName: '',
    eventPoster: null,
    description: '',
    eventDate: '',
    sponsors: [],
  });

  const [subEvents, setSubEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [newSubEvent, setNewSubEvent] = useState({
    subEventName: '',
    entryFee: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    contacts: [{ name: '', phone: '' }],
    rulebookPDF: null,
    rounds: [],
  });

  // Handler for picking event poster
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

  // Handler for adding a sponsor image
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

  const updateSponsor = (index, key, value) => {
    const newSponsors = [...mainEvent.sponsors];
    newSponsors[index][key] = value;
    setMainEvent({ ...mainEvent, sponsors: newSponsors });
  };

  // Handler to add a new subevent dynamically
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
      date: '',
      time: '',
      venue: '',
      contacts: [{ name: '', phone: '' }],
      rulebookPDF: null,
      rounds: [],
    });
  };

  const updateSubEventContact = (contactIndex, value) => {
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

  const addSubEventContact = () => {
    setNewSubEvent({ ...newSubEvent, contacts: [...newSubEvent.contacts, { name: '', phone: '' }] });
  };

  // Handler for picking a rulebook PDF
  const pickRulebookPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });

    if (!result.canceled) {
      setNewSubEvent({
        ...newSubEvent,
        rulebookPDF: {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
        },
      });
    }
  };

  const addRound = () => {
    setNewSubEvent({
      ...newSubEvent,
      rounds: [...newSubEvent.rounds, { roundTime: '', description: [''] }],
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

  // Handlers for adding and updating rounds
  const addRound = () => {
    setNewSubEvent({
      ...newSubEvent,
      rounds: [...newSubEvent.rounds, { roundTime: '', description: [''] }],
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

  const handleSubmit = () => {
    const eventDetails = { ...mainEvent, subEvents };
    console.log('Event Created:', eventDetails);
    // Logic to send the eventDetails to backend
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
      <TextInput
        style={styles.input}
        placeholder="Event Start Date"
        value={mainEvent.eventDate}
        onChangeText={(text) =>
          setMainEvent({ ...mainEvent, eventDate: text })
        }
      />

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
            placeholder="Sponsor Type (e.g., Media Partner, Title Sponsor)"
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
      <Button title="Add Sponsor" onPress={addSponsor} />

      {/* Subevent Button */}
      <Button title="Add Subevent" onPress={addSubEvent} />

      {/* Subevent Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Subevent</Text>

            <TextInput
              style={styles.input}
              placeholder="Subevent Name"
              value={newSubEvent.subEventName}
              onChangeText={(text) => setNewSubEvent({ ...newSubEvent, subEventName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Entry Fee"
              value={newSubEvent.entryFee}
              keyboardType="numeric"
              onChangeText={(text) => setNewSubEvent({ ...newSubEvent, entryFee: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Subevent Description"
              value={newSubEvent.description}
              onChangeText={(text) => setNewSubEvent({ ...newSubEvent, description: text })}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={newSubEvent.date}
              onChangeText={(text) => setNewSubEvent({ ...newSubEvent, date: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={newSubEvent.time}
              onChangeText={(text) => setNewSubEvent({ ...newSubEvent, time: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Venue"
              value={newSubEvent.venue}
              onChangeText={(text) => setNewSubEvent({ ...newSubEvent, venue: text })}
            />

            {/* Rulebook PDF */}
            <TouchableOpacity onPress={pickRulebookPDF} style={styles.imagePicker}>
              {newSubEvent.rulebookPDF ? (
                <Text>{newSubEvent.rulebookPDF.name}</Text>
              ) : (
                <Text>Pick Rulebook PDF</Text>
              )}
            </TouchableOpacity>

            {/* Subevent Contacts */}
            <Text style={styles.subtitle}>Contacts</Text>
            {newSubEvent.contacts.map((contact, contactIndex) => (
              <TextInput
                key={contactIndex}
                style={styles.input}
                placeholder={`Contact ${contactIndex + 1}`}
                value={contact}
                onChangeText={(text) => updateSubEventContact(contactIndex, text)}
              />
            ))}

            <View style={styles.buttonContainer}>
              <Button title="Save Subevent" onPress={handleAddSubEvent} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </ScrollView>
      </Modal>

      <Button title="Submit Event" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  sponsorContainer: {
    marginBottom: 15,
  },
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  scrollView: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AddEvent;