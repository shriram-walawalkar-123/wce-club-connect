import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icons from react-native-vector-icons
import SummaryApi from '../backendRoutes';

const AllUploadedEvents = () => {
  const [allEvent, setAllEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchAllEvent = useCallback(async () => {
    try {
      setLoading(true);
  
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing");
  
      const response = await fetch(SummaryApi.get_club_event.url, {
        method: SummaryApi.get_club_event.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAllEvent(data?.events);
      } else {
        setError("No events found.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteEvent = async (eventId) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Authentication token is missing");
    try {
      const response = await fetch(SummaryApi.delete_event.url, {
        method: SummaryApi.delete_event.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify({eventId}),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Event deleted successfully");
        fetchAllEvent(); // Refresh events after deletion
      } else {
        setError("Failed to delete event.");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event.");
    }
  };

  const confirmDelete = (eventId) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteEvent(eventId),
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAllEvent);
  
    return unsubscribe;
  }, [navigation, fetchAllEvent]);
  

  const handleNavigate = (item) => {
    navigation.navigate('showEvent', { event: item });
  };

  const handleEdit = (item) => {
    navigation.navigate('EditEvent', { event: item });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Uploaded Events</Text>
        </View>
        {allEvent?.length === 0 ? (
          <Text style={styles.noEventsText}>No events available.</Text>
        ) : (
          allEvent.map((item, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity onPress={() => handleNavigate(item)}>
                <Image
                  source={{ uri: item?.eventPoster }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
                <Text style={styles.eventName}>{item?.eventName}</Text>
                <Text style={styles.eventDate}>
                  <Icon name="calendar-outline" size={16} color="#555" />{' '}
                  {`Date: ${new Date(item?.eventDate).toLocaleDateString()}`}
                </Text>
                <Text style={styles.eventDescription}>
                  <Icon name="location-outline" size={16} color="#555" />{' '}
                  {item?.description}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>
                    <Icon name="pencil-outline" size={18} color="#fff" /> Edit Event
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDelete(item._id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>
                    <Icon name="trash-outline" size={18} color="#fff" /> Delete Event
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  noEventsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2, 
    borderColor: 'black',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AllUploadedEvents;
