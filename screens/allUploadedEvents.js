import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SummaryApi from '../backendRoutes';

const AllUploadedEvents = () => {
  const [allEvent, setAllEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchAllEvent = async () => {
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

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setAllEvent(data?.events);
      } else {
        setError("No events found.");

      }
    } catch (err) {
      console.error("Error in showAll event fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set up navigation listener for focus event
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllEvent();
    });

    return unsubscribe;
  }, [navigation]);


  const handleNavigate = (item) => {
    navigation.navigate('showEvent', { event: item });
  };

  const handleEdit = (item) => {
    navigation.navigate('EditEvent', { event: item });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View className="p-4 bg-slate-200 mb-10">
        <View>
          <Text className="text-xl font-bold bg-green-500 text-white p-3 text-center mb-5">
            Uploaded Events
          </Text>
        </View>
        {allEvent?.length === 0 ? (
          <Text className="text-center text-gray-600">No events available.</Text>
        ) : (
          allEvent.map((item, index) => (
            <View key={index} className="mb-4 p-4 border border-gray-300 rounded-lg shadow">
              <TouchableOpacity onPress={() => handleNavigate(item)}>
                <Image
                  source={{ uri: item?.eventPoster }}
                  className="h-52 rounded-lg mb-3"
                  resizeMode="cover"
                />
                <Text className="text-lg font-semibold mb-1">{item?.eventName}</Text>
                <Text>{`Date: ${new Date(item?.eventDate).toLocaleDateString()}`}</Text>
                <Text className="text-gray-700">{item?.description}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleEdit(item)}
                className="mt-2 bg-blue-500 p-2 rounded"
              >
                <Text className="text-white text-center">Edit Event</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default AllUploadedEvents;