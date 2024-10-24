import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../helper/uploadImage'; // Function to upload image
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryApi from '../backendRoutes'; // Backend API routes
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for delete button

export default function GalleryScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to send multiple image URLs to the backend
  const sendImagesToBackend = async (imageUrls) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(SummaryApi.club_gallery.url, {
        method: SummaryApi.club_gallery.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventPhoto: imageUrls }),
      });

      const data = await response.json();
      if (data.success) {
        fetchAllGallery();
      } else {
        console.error("Failed to send images:", data.message);
      }
    } catch (error) {
      console.error('Error sending images to backend:', error);
    }
  };

  // Function to delete an image from the backend
  const deleteImageFromBackend = async (imageId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(SummaryApi.club_gallery_detele.url, {
        method: SummaryApi.club_gallery_detele.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      });

      const data = await response.json();
      if (data.success) {
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
      if (data && data.success) {
        setGallery(data.gallery || []);
      } else {
        console.error("Failed to fetch images:", data ? data.message : "No data");
      }
    } catch (error) {
      console.error('Error fetching images from backend:', error);
    }
  };

  // Function to upload multiple photos
  const uploadPhotos = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const uploadedUrls = [];
        // Upload each selected image
        for (const asset of result.assets) {
          const dataResponse = await uploadImage(asset.uri);
          if (dataResponse.secure_url) {
            uploadedUrls.push(dataResponse.secure_url);
          }
        }
        // Send all uploaded URLs to backend at once
        await sendImagesToBackend(uploadedUrls);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload images. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    fetchAllGallery();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload New Photos</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={uploadPhotos} disabled={uploading}>
        <Text style={styles.uploadButtonText}>{uploading ? "Uploading..." : "Upload Photos"}</Text>
      </TouchableOpacity>

      <ScrollView style={styles.galleryContainer}>
        {gallery.length > 0 ? (
          <View style={styles.imageGrid}>
            {gallery.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <TouchableOpacity onPress={() => {
                  setSelectedImage(image.url);
                  setModalVisible(true);
                }}>
                  <Image source={{ uri: image.url }} style={styles.galleryImage} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteImageFromBackend(image._id)}
                >
                  <MaterialIcons name="delete" size={28} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noImagesText}>No images to display</Text>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} />}
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
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E86C1',
  },
  uploadButton: {
    backgroundColor: '#2980B9',
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
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  galleryImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  deleteButton: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#DCDCDC',
    borderRadius: 5,
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
    marginBottom: 10,
  },
});