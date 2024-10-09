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
        sponsors: [...mainEvent.sponsors, { sponsorType: '', image: result.assets[0].uri }],
      });
    }
  };

  const updateSponsor = (index, key, value) => {
    const newSponsors = [...mainEvent.sponsors];
    newSponsors[index][key] = value;
    setMainEvent({ ...mainEvent, sponsors: newSponsors });
  };

  // Handler for adding a new subevent
  const addSubEvent = () => {
    setModalVisible(true);
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

  // Handler for subevent contacts
  const updateSubEventContact = (contactIndex, key, value) => {
    const updatedContacts = [...newSubEvent.contacts];
    updatedContacts[contactIndex][key] = value;
    setNewSubEvent({ ...newSubEvent, contacts: updatedContacts });
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
      setNewSubEvent({ ...newSubEvent, rulebookPDF: { uri: result.uri, name: result.name } });
    }
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
    // Here, you'd typically send eventDetails to the backend.
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
            placeholder="Sponsor Type (e.g., Media Partner)"
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

      {/* Display SubEvents */}
      <Text style={styles.subtitle}>Subevents</Text>
      {subEvents.map((subEvent, index) => (
        <View key={index} style={styles.subEventContainer}>
          <Text style={styles.subEventTitle}>{subEvent.subEventName}</Text>
          <Text>{`Entry Fee: ${subEvent.entryFee}`}</Text>
          <Text>{`Date: ${subEvent.date}`}</Text>
          <Text>{`Time: ${subEvent.time}`}</Text>
          <Text>{`Venue: ${subEvent.venue}`}</Text>
        </View>
      ))}

      {/* Button to add subevents */}
      <Button title="Add Subevent" onPress={addSubEvent} />

      {/* Subevent Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
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

            {/* Contacts Section */}
            <Text style={styles.subtitle}>Contacts</Text>
            {newSubEvent.contacts.map((contact, contactIndex) => (
              <View key={contactIndex} style={styles.contactContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Contact Name"
                  value={contact.name}
                  onChangeText={(text) => updateSubEventContact(contactIndex, 'name', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Phone"
                  value={contact.phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => updateSubEventContact(contactIndex, 'phone', text)}
                />
              </View>
            ))}
            <Button title="Add Another Contact" onPress={addSubEventContact} />

            {/* Rulebook Picker */}
            <TouchableOpacity onPress={pickRulebookPDF} style={styles.button}>
              <Text>Pick Rulebook PDF</Text>
            </TouchableOpacity>
            {newSubEvent.rulebookPDF && <Text>Selected: {newSubEvent.rulebookPDF.name}</Text>}

            {/* Rounds Section */}
            <Text style={styles.subtitle}>Rounds</Text>
            {newSubEvent.rounds.map((round, roundIndex) => (
              <View key={roundIndex} style={styles.roundContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Round Time"
                  value={round.roundTime}
                  onChangeText={(text) => updateRound(roundIndex, 'roundTime', text)}
                />
                {round.description.map((point, descIndex) => (
                  <TextInput
                    key={descIndex}
                    style={styles.input}
                    placeholder={`Description Point ${descIndex + 1}`}
                    value={point}
                    onChangeText={(text) => updateRoundDescription(roundIndex, descIndex, text)}
                  />
                ))}
                <Button title="Add Description Point" onPress={() => addRoundDescriptionPoint(roundIndex)} />
              </View>
            ))}
            <Button title="Add Round" onPress={addRound} />

            {/* Finalize Subevent */}
            <Button title="Add Subevent" onPress={handleAddSubEvent} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </ScrollView>
      </Modal>

      {/* Submit Event */}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sponsorContainer: {
    marginBottom: 10,
  },
  subEventContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  subEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  roundContainer: {
    marginBottom: 20,
  },
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AddEvent;