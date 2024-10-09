import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../helper/uploadImage'; // Function to upload image
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryApi from '../backendRoutes'; // Backend API routes

export default function GalleryScreen() {
  const [selectedImage, setSelectedImage] = useState(null); // State to handle selected image for viewing in modal
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [uploading, setUploading] = useState(false); // State to handle loading state during image upload
  const [gallery, setGallery] = useState([]); // State to hold gallery data from the backend

  // Function to send a single image URL to the backend
  const sendImageToBackend = async (imageUrl) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(SummaryApi.club_gallery.url, {
        method: SummaryApi.club_gallery.method, // Assuming POST method for sending the image
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventPhoto: [imageUrl] }), // Send only the newly uploaded image URL
      });

      const data = await response.json();
      if (data.success) {
        fetchAllGallery(); // Fetch gallery after successful upload
      } else {
        console.error("Failed to send image:", data.message);
      }
    } catch (error) {
      console.error('Error sending image to backend:', error);
    }
  };

  // Function to delete an image from the backend
  const deleteImageFromBackend = async (imageId) => {
    console.log("imageId",imageId);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(SummaryApi.club_gallery_detele.url, {
        method: SummaryApi.club_gallery_detele.method, // Assuming DELETE method for image deletion
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({imageId})
      });

      const data = await response.json();
      if (data.success) {
        // Remove the image from the gallery state after successful deletion
        fetchAllGallery();
      } else {
        console.error("Failed to delete image:", data.message);
      }
    } catch (error) {
      console.error('Error deleting image from backend:', error);
    }
  };

  // Fetch all gallery images from the backend
  const fetchAllGallery = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(SummaryApi.get_club_gallery.url, {
        method: SummaryApi.get_club_gallery.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data && data.success) {
        setGallery(data.gallery || []); // Ensure data.gallery exists
      } else {
        console.error("Failed to fetch images:", data ? data.message : "No data");
      }
    } catch (error) {
      console.error('Error fetching images from backend:', error);
    }
  };

  // Upload photo function
  const uploadPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      try {
        setUploading(true);
        const dataResponse = await uploadImage(selectedImageUri); // Upload image

        if (dataResponse.url) {
          await sendImageToBackend(dataResponse.url); // Send the newly uploaded image URL to the backend
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    fetchAllGallery(); // Call the function to fetch images when screen loads
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a New Photo</Text>

      {/* Upload Photo Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto} disabled={uploading}>
        <Text style={styles.uploadButtonText}>{uploading ? "Uploading..." : "Upload Photo"}</Text>
      </TouchableOpacity>

      <ScrollView style={styles.galleryContainer}>
        {gallery.length > 0 ? (
          gallery.map((image, index) => (  // Use 'image' to represent each gallery item
            <View key={index} style={styles.imageWrapper}>
              <TouchableOpacity onPress={() => { 
                setSelectedImage(image.url); // Set the URL for the selected image
                setModalVisible(true); 
              }}>
                <Image source={{ uri: image.url }} style={styles.galleryImage} />
              </TouchableOpacity>
              {/* Delete Button */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImageFromBackend(image._id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noImagesText}>No images to display</Text>
        )}
      </ScrollView>

      {/* Modal to show full-screen image */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryContainer: {
    marginTop: 20,
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#ff6666',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noImagesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
