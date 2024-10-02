import React from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ClubOptionsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('UpdateDescriptionScreen')}
      >
        <Text style={styles.buttonText}>Update Club Description</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('UpdateMembersScreen')}
      >
        <Text style={styles.buttonText}>Update Club Members</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.optionButton}
      onPress={() => navigation.navigate('GalleryScreen')}
      >
        <Text style={styles.buttonText}>Update Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.optionButton}
      onPress={() => navigation.navigate('ContactInfoScreen')}
      >
        <Text style={styles.buttonText}>Update Contact Info</Text>
      </TouchableOpacity>


      {/* Add more options as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.1,  // Padding according to screen width
    backgroundColor: '#f7f7f7',  // Light background
  },
  optionButton: {
    backgroundColor: '#4A90E2',  // Button background color
    paddingVertical: height * 0.02,  // Responsive vertical padding
    paddingHorizontal: width * 0.05,  // Responsive horizontal padding
    borderRadius: 10,
    marginVertical: height * 0.02,  // Space between buttons
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,  // Shadow for Android
  },
  buttonText: {
    fontSize: width * 0.045,  // Responsive font size
    color: '#fff',  // White text color
    fontWeight: 'bold',
  },
});

export default ClubOptionsScreen;
