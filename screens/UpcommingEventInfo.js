import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';
import { useNavigation } from '@react-navigation/native';

const UpcommingEventsInfo= ({ route }) => {
  const { clubId } = route.params;
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(SummaryApi.get_club_upcomming_events.url, {
        method: SummaryApi.get_club_upcomming_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });
      const data = await response.json();
      if(data.success===true){
        setUpcomingEvents(data.data); // Update the state with fetched events
      }else{
        Alert("not only upcomming events");
      }
    } catch (err) {
      console.error(err); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No upcoming events available</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => navigation.navigate('showEvent', { event: item })}
    >
      <Image source={{ uri: item?.eventPoster }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <View style={styles.eventDetailsRow}>
          <FontAwesome5 name="calendar-alt" size={16} color="#555" style={styles.icon} />
          <Text style={styles.eventDetails}>{new Date(item.eventDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.eventDetailsRow}>
          <MaterialIcons name="description" size={16} color="#555" style={styles.icon} />
          <Text style={styles.eventDetails}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={upcomingEvents}
      keyExtractor={(item) => item._id} // Assuming each event has a unique _id
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  emptyText: {
    fontSize: 18,
    color: '#4b5563',
  },
  eventContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,         // Thickness of the border
    borderColor: 'black',
  },
  eventImage: {
    height: 160,
    width: '100%',
    borderRadius: 8,
    borderWidth: 2,         // Thickness of the border
    borderColor: 'black',
  },
  eventContent: {
    paddingTop: 12,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  icon: {
    marginRight: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginBottom: 4,
  },
  listContent: {
    padding: 20,
  },
});

export default UpcommingEventsInfo;
