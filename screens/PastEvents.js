import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import SummaryApi from '../backendRoutes';

// Ensure NativeWind is properly set up before using className
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
    <View className="mb-5 px-4">
      <Text className="text-xl font-bold text-blue-800 mb-2">{item.eventName}</Text>
      <View className="bg-white rounded-lg overflow-hidden shadow-md">
        <Image source={{ uri: item.eventPoster }} className="w-full h-44 rounded-t-lg" />
        <View className="p-3">
          <Text className="text-gray-700">{item.description}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  // Check if there are no past events to display
  if (pastEvents.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-700">No past events found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pastEvents}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
