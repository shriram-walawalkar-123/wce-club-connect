import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AllUploadedEvents from './allUploadedEvents'; // Component to show all events
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const UploadEventScreen = () => {
  const navigation = useNavigation();

  const handleNavigateToUpload = () => {
    navigation.navigate('AddEvent'); // Pass the handler to the next screen
  };

  return (
    <View style={styles.container}>
      {/* Upload event button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleNavigateToUpload}>
        <MaterialIcons name="cloud-upload" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Upload Event</Text>
      </TouchableOpacity>

      {/* Render the component that shows all uploaded events */}
      <AllUploadedEvents />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20, // Add padding around the content
    marginBottom:50

  },
  uploadButton: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Vertically center the icon and text
    backgroundColor: '#9EDDFF', // New color for the button (orange)
    paddingVertical: 12, // Padding for height
    paddingHorizontal: 20, // Padding for width
    borderRadius: 30, // Make the button rounded
    justifyContent: 'center', // Center the text and icon
    marginBottom: 20, // Add space below the button
  },
  icon: {
    marginRight: 10, // Add space between the icon and text
    color:'black',
  },
  buttonText: {
    color: 'black', // White text color
    fontSize: 16, // Text size
    fontWeight: 'bold', // Bold text
  },
});

export default UploadEventScreen;
