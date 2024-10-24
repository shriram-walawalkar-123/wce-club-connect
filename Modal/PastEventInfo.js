import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, Alert, Modal } from 'react-native';
import SummaryApi from '../backendRoutes';

const PastEventInfo = ({ clubId, onClose, visible }) => {
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
      if (data.success) {
        setPastEvents(data.data);
        // Show alert if there are no past events
        if (data.data.length === 0) {
          Alert.alert("No Past Events", "No past events found.");
          onClose(); // Close the modal if it's open
        }
      } else {
        Alert.alert("Error", "Failed to get past events.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while fetching past events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastEvents();
  }, [clubId]);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.eventContainer}>
      {item.eventPoster && (
        <Image
          source={{ uri: item.eventPoster }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.eventContent}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDate}>
          {new Date(item.eventDate).toLocaleDateString()}
        </Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
    </View>
  ), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  // Do not show modal if there are no past events
  if (pastEvents.length === 0) {
    return null; // Prevents the modal from opening
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Past Events</Text>
          <FlatList
            data={pastEvents}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<View style={styles.footerContainer}><Text>End of Events</Text></View>}
          />
          <Text style={styles.closeButton} onPress={onClose}>Close</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Adjusted to semi-transparent black for overlay
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#000401', // Jet Black for modal background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e5e8e8', // White
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  eventContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#4e545c', // Gunmetal Gray
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
  eventContent: {
    marginTop: 8,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e5e8e8', // White
  },
  eventDate: {
    fontSize: 14,
    color: '#8d9797', // Pewter
    marginTop: 4,
  },
  eventDescription: {
    fontSize: 16,
    color: '#e5e8e8', // White
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 18,
    color: '#e5e8e8', // White
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PastEventInfo;
