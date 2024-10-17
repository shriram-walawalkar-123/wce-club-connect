import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Image, ActivityIndicator, TouchableOpacity, ScrollView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import uploadImage from '../helper/uploadImage';

export default function MainEvent({ setEvent, event, closeModal }) {
  const [clubName, setClubName] = useState(event.mainEvent.clubName);
  const [eventName, setEventName] = useState(event.mainEvent.eventName);
  const [description, setDescription] = useState(event.mainEvent.description);
  const [prizePool, setPrizePool] = useState(event.mainEvent.prizePool);
  const [eventDate, setEventDate] = useState(event.mainEvent.eventDate);
  const [eventPoster, setEventPoster] = useState(event.mainEvent.eventPoster);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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
      setEventPoster(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    let uploadedPosterUrl = eventPoster;

    if (eventPoster) {
      uploadedPosterUrl = await uploadImage(eventPoster);
      console.log("uploadedPosterUrl", uploadedPosterUrl);
    }

    setEvent(prevEvent => ({
      ...prevEvent,
      mainEvent: {
        ...prevEvent.mainEvent,
        clubName,
        eventName,
        eventPoster: uploadedPosterUrl?.secure_url,
        description,
        prizePool,
        eventDate,
      },
    }));

    setLoading(false);
    closeModal();
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate;
    setShowDatePicker(false);
    setEventDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Main Event</Text>

        <View style={styles.inputContainer}>
          <AntDesign name="team" size={24} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Club Name"
            value={clubName}
            onChangeText={setClubName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="event" size={24} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            value={eventName}
            onChangeText={setEventName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="description" size={24} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="trophy" size={24} color="#4A90E2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Prize Pool"
            value={prizePool}
            onChangeText={setPrizePool}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <AntDesign name="calendar" size={24} color="#FFFFFF" />
          <Text style={styles.dateButtonText}>Select Event Date</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={eventDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {eventDate && (
          <Text style={styles.selectedDate}>
            Selected Date: {eventDate.toLocaleDateString()}
          </Text>
        )}

        <TouchableOpacity style={styles.posterButton} onPress={pickEventPoster}>
          <AntDesign name="picture" size={24} color="#FFFFFF" />
          <Text style={styles.posterButtonText}>Pick Event Poster</Text>
        </TouchableOpacity>

        {eventPoster && (
          <Image
            source={{ uri: eventPoster }}
            style={styles.posterImage}
          />
        )}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : (
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Update Main Event</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  multilineInput: {
    height: 80,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  dateButtonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  selectedDate: {
    marginBottom: 15,
    color: '#333',
  },
  posterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  posterButtonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  posterImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});