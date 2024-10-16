import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, ScrollView, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainEvent from '../Modal/MainEvent';
import Sponsor from '../Modal/Sponsor';
import SubEvent from '../Modal/SubEvent';
import SummaryApi from '../backendRoutes';
import { useNavigation } from '@react-navigation/native';

export default function AddEvent() {
  const navigation = useNavigation();
  const [Event, setEvent] = useState({
    mainEvent: {
      clubName: '',
      eventName: '',
      eventPoster: null,
      description: '',
      prizePool: '',
      eventDate: new Date(),
      sponsors: [],
    },
    subEvents: [
      {
        subEventName: '',
        entryFee: '',
        description: '',
        date: new Date(),
        time: new Date(),
        venue: '',
        formUrl: '',
        rulebookPDF: { name: '', uri: '' },
        contacts: [{ name: '', phone: '' }],
        rounds: [],
      },
    ],
  });

  const [mainEventVisible, setMainEventVisible] = useState(false);
  const [sponsorVisible, setSponsorVisible] = useState(false);
  const [subEventVisible, setSubEventVisible] = useState(false);

  const AddEvent = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const { mainEvent, subEvents } = Event;
      const eventData = {
        ...mainEvent,
        subEvents,
      };
      const response = await fetch(SummaryApi.club_event_add.url, {
        method: SummaryApi.club_event_add.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      if(data.success===true){
        navigation.navigate('UploadEventScreen');
      } else {
        Alert.alert("Error", "There was an error submitting the event");
      }
    } catch (err) {
      console.error('Error submitting event:', err);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const renderEventSummary = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Event Summary</Text>
      <Text style={styles.cardSubtitle}>Main Event: {Event.mainEvent.eventName || 'Not set'}</Text>
      <Text style={styles.cardText}>Club: {Event.mainEvent.clubName || 'Not set'}</Text>
      <Text style={styles.cardText}>Date: {Event.mainEvent.eventDate.toDateString()}</Text>
      <Text style={styles.cardText}>Prize Pool: {Event.mainEvent.prizePool || 'Not set'}</Text>
      <Text style={styles.cardSubtitle}>Sub Events: {Event.subEvents.length}</Text>
      <Text style={styles.cardText}>Sponsors: {Event.mainEvent.sponsors.length}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create a New Event</Text>
        
        {renderEventSummary()}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.mainEventButton]}
            onPress={() => setMainEventVisible(true)}
          >
            <Icon name="calendar" size={24} color="white" />
            <Text style={styles.buttonText}>Main Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sponsorButton]}
            onPress={() => setSponsorVisible(true)}
          >
            <Icon name="people" size={24} color="white" />
            <Text style={styles.buttonText}>Sponsors</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.subEventButton]}
          onPress={() => setSubEventVisible(true)}
        >
          <Icon name="pricetag" size={24} color="white" />
          <Text style={styles.buttonText}>Sub Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={AddEvent}
        >
          <Icon name="cloud-upload" size={24} color="white" />
          <Text style={styles.buttonText}>Submit Event</Text>
        </TouchableOpacity>

        <Modal visible={mainEventVisible} animationType="slide">
          <MainEvent setEvent={setEvent} event={Event} closeModal={() => setMainEventVisible(false)} />
        </Modal>

        <Modal visible={sponsorVisible} animationType="slide">
          <Sponsor setEvent={setEvent} event={Event} closeModal={() => setSponsorVisible(false)} />
        </Modal>

        <Modal visible={subEventVisible} animationType="slide">
          <SubEvent setEvent={setEvent} event={Event} closeModal={() => setSubEventVisible(false)} />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3748',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginTop: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  mainEventButton: {
    backgroundColor: '#4c51bf',
    flex: 1,
    marginRight: 8,
  },
  sponsorButton: {
    backgroundColor: '#ed64a6',
    flex: 1,
    marginLeft: 8,
  },
  subEventButton: {
    backgroundColor: '#ecc94b',
  },
  submitButton: {
    backgroundColor: '#48bb78',
  },
});