import { StyleSheet, View, Text, Button, TextInput, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import uploadImage from '../helper/uploadImage'; // Import the uploadImage function

export default function MainEvent({ setEvent, event, closeModal }) {
  const [clubName, setClubName] = useState(event.mainEvent.clubName);
  const [eventName, setEventName] = useState(event.mainEvent.eventName);
  const [description, setDescription] = useState(event.mainEvent.description);
  const [prizePool, setPrizePool] = useState(event.mainEvent.prizePool);
  const [eventDate, setEventDate] = useState(event.mainEvent.eventDate);
  const [eventPoster, setEventPoster] = useState(event.mainEvent.eventPoster);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to manage the visibility of the date picker
  const [loading, setLoading] = useState(false); // Loading state

  // Function to pick an image from the gallery
  const pickEventPoster = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEventPoster(result.assets[0].uri); // Set the selected image URI for event poster
    }
  };

  const handleUpdate = async () => {
    setLoading(true); // Set loading to true

    let uploadedPosterUrl = eventPoster; // Default to current URL

    // Upload the image if a new one is selected
    if (eventPoster) {
      uploadedPosterUrl = await uploadImage(eventPoster); // Upload to Cloudinary
      console.log("uploadedPosterUrl", uploadedPosterUrl);
    }

    setEvent(prevEvent => ({
      ...prevEvent,
      mainEvent: {
        ...prevEvent.mainEvent,
        clubName,
        eventName,
        eventPoster: uploadedPosterUrl?.secure_url, // Use the uploaded URL
        description,
        prizePool,
        eventDate,
      },
    }));

    setLoading(false); // Set loading to false
    closeModal(); // Close the modal after updating
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate; // Use the selected date or the existing date
    setShowDatePicker(false); // Hide the picker after selection
    setEventDate(currentDate); // Update the event date
  };

  return (
    <View>
      <Text>Main Event</Text>

      {/* Club Name Input */}
      <TextInput
        placeholder="Club Name"
        value={clubName}
        onChangeText={setClubName}
      />

      {/* Event Name Input */}
      <TextInput
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />

      {/* Description Input */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Prize Pool Input */}
      <TextInput
        placeholder="Prize Pool"
        value={prizePool}
        onChangeText={setPrizePool}
        keyboardType="numeric"
      />

      {/* Event Date Picker */}
      <Button title="Select Event Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={eventDate || new Date()} // Use the selected date or current date
          mode="date" // Set mode to "date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {eventDate && (
        <Text>Selected Date: {eventDate.toLocaleDateString()}</Text>
      )}

      {/* Event Poster Image Picker */}
      <Button title="Pick Event Poster" onPress={pickEventPoster} />
      
      {/* Display the selected Event Poster below the button */}
      {eventPoster && (
        <Image
          source={{ uri: eventPoster }}
          style={{ width: 200, height: 200, marginTop: 10 }} // Adjust width and height as needed
        />
      )}

      {/* Update Button with Loader */}
      <View style={{ marginTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" /> // Show loader
        ) : (
          <Button title="Update Main Event" onPress={handleUpdate} />
        )}
      </View>
      
      {/* Close Button */}
      <Button title="Close" onPress={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({});
