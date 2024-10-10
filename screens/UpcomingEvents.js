import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import SummaryApi from '../backendRoutes';

// Assuming you have an API file for the endpoint

const UpcomingEventsScreen = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]); // State to hold events
  const [loading, setLoading] = useState(true); // State to handle loading

  // Function to fetch upcoming events from the backend
  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(SummaryApi.get_all_upcomming_events.url, {
        method:SummaryApi.get_all_upcomming_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // // Check for response status
      // if (!response.ok) {
      //   console.error('Response status:', response.status);
      //   throw new Error('Failed to fetch events');
      // }
  
      const data = await response.json();
      console.log("data",data.data);
      setUpcomingEvents(data.data); // Assuming the events are under data.data
    } catch (error) {
      console.error('Error fetching events:', error.message); // Improved error logging
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  
  useEffect(() => {
    fetchUpcomingEvents(); // Fetch events when component mounts
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ margin: 20, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }}>
      <Image source={{ uri: item.eventImage }} style={{ width: 200, height: 200, borderRadius: 10 }} />
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 5 }}>{item.eventName}</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text>Venue: {item.venue}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Rulebook: <Text style={{ color: 'blue' }}>{item.rulebook}</Text></Text>
      <Text>Rounds: {item.rounds}</Text>
    </View>
  );

  // Display a loading indicator while fetching data
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={upcomingEvents}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }} // Extra padding for bottom
    />
  );
};

export default UpcomingEventsScreen;
