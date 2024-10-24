import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const UpcommingEventsInfo = ({ clubId, onClose, visible }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isMounted = useRef(true);

  const fetchUpcomingEvents = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.get_club_upcomming_events.url, {
        method: SummaryApi.get_club_upcomming_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });
      const data = await response.json();
      if (data.success === true && isMounted.current) {
        setUpcomingEvents(data.data);
        // Show alert if there are no upcoming events
        if (data.data.length === 0) {
          Alert.alert("No Upcoming Events", "No upcoming events found.");
          onClose(); // Close the modal if it's open
        }
      } else if (isMounted.current) {
        Alert.alert("Error", "No upcoming events found.");
        onClose(); // Close the modal if it's open
      }
    } catch (err) {
      console.error(err);
      if (isMounted.current) {
        Alert.alert("Error", "Failed to fetch upcoming events.");
        onClose(); // Close the modal if it's open
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [clubId, onClose]);

  useEffect(() => {
    fetchUpcomingEvents();
    return () => {
      isMounted.current = false;
    };
  }, [fetchUpcomingEvents]);

  useFocusEffect(
    useCallback(() => {
      fetchUpcomingEvents();
    }, [fetchUpcomingEvents])
  );

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => navigation.navigate('showEvent', { event: item })}
    >
      <Image source={{ uri: item?.eventPoster }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <View style={styles.eventDetailsRow}>
          <FontAwesome5 name="calendar-alt" size={16} color="#ffffff" style={styles.icon} />
          <Text style={styles.eventDetails}>{new Date(item.eventDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.eventDetailsRow}>
          <MaterialIcons name="description" size={16} color="#ffffff" style={styles.icon} />
          <Text style={styles.eventDetails} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (upcomingEvents.length === 0) {
    return null; // Do not show anything if there are no events
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Upcoming Events</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingEvents}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            removeClippedSubviews={true}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={21}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    height: height * 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
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
    backgroundColor: '#4e545c',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  eventImage: {
    height: 160,
    width: '100%',
    borderRadius: 8,
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
    color: '#ffffff',
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  listContent: {
    padding: 20,
  },
});

export default React.memo(UpcommingEventsInfo);
