import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const AddEvent = () => {
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
  const [newSubEvent, setNewSubEvent] = useState({
    subEventName: '',
    entryFee: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    contacts: ['', ''],
    rulebookPDF: null,
  });

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
        sponsors: [...mainEvent.sponsors, { sponsorType: '', image: result.assets[0].uri }],
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
  };

  const handleAddSubEvent = () => {
    setSubEvents([...subEvents, newSubEvent]);
    setModalVisible(false);
    setNewSubEvent({
      subEventName: '',
      entryFee: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      contacts: ['', ''],
      rulebookPDF: null,
    });
  };

  const updateSubEventContact = (contactIndex, value) => {
    const updatedContacts = [...newSubEvent.contacts];
    updatedContacts[contactIndex] = value;
    setNewSubEvent({ ...newSubEvent, contacts: updatedContacts });
  };

  const pickRulebookPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });

    if (!result.canceled) {
      setNewSubEvent({ ...newSubEvent, rulebookPDF: { uri: result.uri, name: result.name } });
    }
  };

  const handleSubmit = () => {
    const eventDetails = { ...mainEvent, subEvents };
    console.log('Event Created:', eventDetails);
    // Logic to send the eventDetails to backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create a New Event</Text>

      {/* Main Event Details */}
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
      <TextInput
        style={styles.input}
        placeholder="Event Start Date"
        value={mainEvent.eventDate}
        onChangeText={(text) => setMainEvent({ ...mainEvent, eventDate: text })}
      />

      {/* Event Poster */}
      <TouchableOpacity onPress={pickEventPoster} style={styles.imagePicker}>
        {mainEvent.eventPoster ? (
          <Image source={{ uri: mainEvent.eventPoster }} style={styles.image} />
        ) : (
          <Text>Pick Event Poster</Text>
        )}
      </TouchableOpacity>

      {/* Sponsor Section */}
      <Text style={styles.subtitle}>Sponsors</Text>
      {mainEvent.sponsors.map((sponsor, index) => (
        <View key={index} style={styles.sponsorContainer}>
          <TextInput
            style={styles.input}
            placeholder="Sponsor Type (e.g., Media Partner, Title Sponsor)"
            value={sponsor.sponsorType}
            onChangeText={(text) => updateSponsor(index, 'sponsorType', text)}
          />
          {sponsor.image ? (
            <Image source={{ uri: sponsor.image }} style={styles.image} />
          ) : (
            <Text>No image selected</Text>
          )}
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
        </View>
      </Modal>

      <Button title="Submit Event" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
