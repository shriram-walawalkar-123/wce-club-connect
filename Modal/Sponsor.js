import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import uploadImage from '../helper/uploadImage';

export default function Sponsor({ setEvent, event, closeModal }) {
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorImage, setSponsorImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable the crop option
      selectionLimit: 0, // 0 means unlimited selection
      quality: 1,
    });

    if (!result.canceled) {
      setSponsorImage(result.assets[0].uri);
    }
  };

  const addSponsor = async () => {
    setIsLoading(true);
    try {
      let uploadedImageUrl = '';

      if (sponsorImage) {
        const uploadResult = await uploadImage(sponsorImage);
        uploadedImageUrl = uploadResult?.secure_url || '';
      }

      setEvent(prevEvent => ({
        ...prevEvent,
        mainEvent: {
          ...prevEvent.mainEvent,
          sponsors: [
            ...prevEvent.mainEvent.sponsors,
            { 
              name: sponsorName, 
              image: uploadedImageUrl 
            }
          ],
        },
      }));

      setSponsorName('');
      setSponsorImage(null);
      closeModal();
    } catch (error) {
      console.error("Error adding sponsor:", error);
      alert("Failed to add sponsor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Sponsor</Text>

      <View style={styles.inputContainer}>
        <AntDesign name="user" size={24} color="#4a90e2" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Sponsor Name"
          value={sponsorName}
          onChangeText={setSponsorName}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <AntDesign name="picture" size={24} color="#fff" />
        <Text style={styles.buttonText}>Pick Sponsor Image</Text>
      </TouchableOpacity>

      {sponsorImage && (
        <Image
          source={{ uri: sponsorImage }}
          style={styles.selectedImage}
        />
      )}

      <TouchableOpacity 
        style={[styles.addButton, isLoading && styles.disabledButton]} 
        onPress={addSponsor}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <AntDesign name="plus" size={24} color="#fff" />
            <Text style={styles.buttonText}>Add Sponsor</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <MaterialIcons name="close" size={24} color="#fff" />
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    elevation: 3,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});