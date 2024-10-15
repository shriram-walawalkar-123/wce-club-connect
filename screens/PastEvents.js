import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import SummaryApi from '../backendRoutes';

export default function PastEvents() {
  const [pastEvents, setPastEvents] = useState([]); // State to hold past events
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch past events from the backend
  const fetchPastEvents = async () => {
    try {
      const response = await fetch(SummaryApi.get_all_past_events.url, {
        method: SummaryApi.get_all_past_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch past events');
      }

      const data = await response.json();
      console.log("All past events:", data);

      if (data.data && data.data.length > 0) {
        setPastEvents(data.data); // Update state if events exist
      } else {
        console.log("No past events found.");
        setPastEvents([]); // Ensure it's empty when no events found
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastEvents(); // Fetch events on component mount
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      {/* Event Name */}
      <Text style={styles.eventName}>{item.eventName}</Text>

      {/* Event Card with Poster and Details */}
      <View style={styles.card}>
        <Image source={{ uri: item?.eventPoster }} style={styles.eventImage} />
        <View style={styles.eventDetails}>
          <Text style={styles.clubName}>{item.clubName}</Text>
          <Text style={styles.eventDescription}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  // Check if there are no past events to display
  if (pastEvents.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noEventsText}>No past events found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pastEvents}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noEventsText: {
    fontSize: 18,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  eventCard: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,         // Thickness of the border
    borderColor: 'black',
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventDetails: {
    padding: 16,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
  },
});
