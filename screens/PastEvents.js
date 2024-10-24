import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';
import { useNavigation } from '@react-navigation/native';

const PastEventsScreen = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(SummaryApi.get_all_past_events.url, {
        method: SummaryApi.get_all_past_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUpcomingEvents(data.data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.eventContainer}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('showEvent', { event: item })}
      > 
        <Image source={{ uri: item?.eventPoster }} style={styles.eventImage} />
        <View style={styles.eventContent}>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <View style={styles.eventDetailsRow}>
            <FontAwesome5 name="calendar-alt" size={16} color="#555" />
            <Text style={styles.eventDetails}>
              {new Date(item.eventDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.eventDetailsRow}>
            <MaterialIcons name="location-on" size={16} color="#555" />
            <Text style={styles.eventDetails}>{item.description}</Text>
          </View>
          {item.fee && (
            <View style={styles.eventDetailsRow}>
              <FontAwesome5 name="money-bill-wave" size={16} color="#555" />
              <Text style={styles.eventDetails}>Fee: ${item.fee}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={upcomingEvents}
      keyExtractor={(item, index) => index.toString()}
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
  },
  listContent: {
    paddingVertical: 16,
  },
  eventContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
});

export default PastEventsScreen;
