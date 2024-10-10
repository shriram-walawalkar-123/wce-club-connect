// PastEventsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image } from 'react-native';
import SummaryApi from '../backendRoutes';
import 'nativewind'; // Import nativewind

const PastEventsScreen = ({ route }) => {
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

      if (!response.ok) {
        throw new Error('Failed to fetch past events.');
      }

      const data = await response.json();
      setPastEvents(data.data); // Update the state with fetched events
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
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (pastEvents.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-700">No past events available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <FlatList
        data={pastEvents}
        keyExtractor={(item) => item._id} // Assuming each event has a unique _id
        renderItem={({ item }) => (
          <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
            {item.eventPoster && (
              <Image
                source={{ uri: item.eventPoster }}
                className="h-40 w-full rounded-t-lg"
                resizeMode="cover"
              />
            )}
            <View className="mt-2">
              <Text className="text-xl font-bold text-blue-800">
                {item.eventName}
              </Text>
              <Text className="text-gray-500">
                {new Date(item.eventDate).toLocaleDateString()}
              </Text>
              <Text className="text-gray-700 mt-2">
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PastEventsScreen;
