import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation,route} from '@react-navigation/native'; // Import useNavigation hook
import SummaryApi from '../backendRoutes';

const AllUploadedEvents = () => {
  const [allEvent, setAllEvent] = useState([]);
  const navigation = useNavigation();

  const fetchAllEvent = async () => {
    try {
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
        setAllEvent(data.events);
      } else {
        console.error("Fetch failed: No events found");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Set up navigation listener for focus event
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllEvent(); // Call the fetch function when the screen is focused
    });
  
    return unsubscribe; // Cleanup the listener on component unmount
  }, [navigation, route]); // Add route as a dependency
  

  const handleNavigate = (item) => {
    navigation.navigate('showEvent', { event: item });
  };

  return (
    <ScrollView>
      <View className="p-50 bg-slate-200 mb-10">
        <View>
          <Text className="text-1xl font-bold bg-green-500 text-white p-3 text-center mb-5">
            Uploaded Events
          </Text>
        </View>
        {allEvent.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="mb-4 p-4 border border-gray-300 rounded-lg"
            onPress={() => handleNavigate(item)}
          >
            <Image
              source={{ uri: item.eventPoster }}
              className="h-52 rounded-lg mb-3"
              resizeMode="cover"
            />
            <Text className="text-lg font-semibold mb-1">{item.eventName}</Text>
            <Text>{`Date: ${new Date(item.eventDate).toLocaleDateString()}`}</Text>
            <Text className="text-gray-700">{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default AllUploadedEvents;
