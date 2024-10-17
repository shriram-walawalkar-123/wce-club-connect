import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, Alert } from 'react-native';
import SummaryApi from '../backendRoutes';

const PastEventInfo = ({ route }) => {
  const { clubId } = route.params;
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPastEvents = async () => {
    try {
      const response = await fetch(SummaryApi.get_club_past_events.url, {
        method: SummaryApi.get_club_past_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });
      const data = await response.json();
      if(data.success===true){
        setPastEvents(data.data); // Update the state with fetched events
      }else{
        Alert("error to get past Events");
      }
    } catch (err) {
      console.error(err); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (pastEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No past events available</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={pastEvents}
        keyExtractor={(item) => item._id} // Assuming each event has a unique _id
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            {item.eventPoster && (
              <Image
                source={{ uri: item.eventPoster}}
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{item.eventName}</Text>
              <Text style={styles.eventDate}>
                {new Date(item.eventDate).toLocaleDateString()}
              </Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  eventCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  eventImage: {
    height: 160,
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  eventDetails: {
    marginTop: 8,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  eventDescription: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
  },
});

export default PastEventInfo;
