import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import SummaryApi from '../backendRoutes';
import RegisterEvent from '../Modal/RegisterEvent';
import { FlatList } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width < 768 ? width * 0.85 : width * 0.4; // Responsive card width
const SPACING = 8;
const CARD_HEIGHT = 420; // Fixed card height for consistency

const UpcomingEventsScreen = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigation = useNavigation();

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(SummaryApi.get_all_upcomming_events.url, {
        method: SummaryApi.get_all_upcomming_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success === true) {
        setUpcomingEvents([{ key: 'left-spacer' }, ...data.data, { key: 'right-spacer' }]);
      } else {
        Alert.alert("Error", "Failed to fetch events");
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const openRegisterEventModal = (event) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeRegisterEventModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const renderItem = ({ item }) => {
    if (!item.eventName) {
      return <View style={{ width: SPACING }} />;
    }

    return (
      <View style={styles.eventContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('showEvent', { event: item })}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.eventPoster }} 
              style={styles.eventImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.eventName} numberOfLines={1}>
              {item.eventName}
            </Text>
            <Text style={styles.eventDate}>
              {new Date(item.eventDate).toLocaleDateString()}
            </Text>
            <Text style={styles.eventDescription} numberOfLines={1}>
              {item.description}
            </Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => openRegisterEventModal(item)}
            >
              <Text style={styles.registerButtonText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e545c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={upcomingEvents}
        keyExtractor={(item, index) => item.id ? item.id.toString() : `spacer-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRegisterEventModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <RegisterEvent event={selectedEvent} onClose={closeRegisterEventModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000401', // Jet Black background
    padding: 16, // Added padding for better spacing around cards
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16, // Add space at the bottom of the list
  },
  eventContainer: {
    width: '100%', // Full width of the container
    height: CARD_HEIGHT,
    marginBottom: SPACING, // Space between cards vertically
  },
  card: {
    flex: 1,
    backgroundColor: '#4e545c', // Gunmetal Gray background for cards
    borderRadius: 16,
    shadowColor: '#000401', // Jet Black shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    height: '60%',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#8d9797', // Pewter background for the card details section
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e5e8e8', // White for event name text
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#e5e8e8', // White for event date text
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#e5e8e8', // White for event description text
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#000401', // Jet Black background for button
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  registerButtonText: {
    color: '#e5e8e8', // White text for button
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for modal background
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#8d9797', // Pewter background for modal content
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default UpcomingEventsScreen;
