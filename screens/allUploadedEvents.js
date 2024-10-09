import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import SummaryApi from '../backendRoutes';
import { useNavigation } from '@react-navigation/native';

const AllUploadedEvents = () => {
  const [allEvent, setAllEvent] = useState([]);
  const navigation = useNavigation(); // Use the navigation hook

  const fetchAllEvent = async () => {
    try {
      // Get the auth token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      // Make the API call
      const response = await fetch(SummaryApi.get_club_event.url, {
        method: SummaryApi.get_club_event.method,
        headers: {
          'Content-Type': 'application/json', // Set content type if needed
          'Authorization': `Bearer ${token}`, // Add the token to the headers
        },
      });

      // Check if the response is okay (status in the range of 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Update the state with events if the fetch is successful
      if (data.success) {
        setAllEvent(data.events);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchAllEvent();
  }, []);

  // Function to handle navigation to event details
  const handleNavigate = (item) => {
    navigation.navigate('showEvent', { event: item }); // Assuming 'EventDetails' is a route in your navigation
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
            onPress={() => handleNavigate(item)} // Correct the onPress to use arrow function
          >
            <Image
              source={{ uri: item.eventPoster }} // Ensure this field is present in your event data
              className="h-52 rounded-lg mb-3"
              resizeMode="cover" // Makes sure the image covers the area
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
