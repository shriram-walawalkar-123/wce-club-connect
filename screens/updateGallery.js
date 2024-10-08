import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateGallery } from '../slices/clubSlice';  // Redux action to update gallery
import uploadImage from '../helper/uploadImage';

export default function GalleryScreen() {
  const dispatch = useDispatch();
  const { gallery } = useSelector((state) => state.club);  // Select gallery from Redux
  const [localGallery, setLocalGallery] = useState([...gallery]);
  const [selectedImage, setSelectedImage] = useState(null);  // State to handle selected image for viewing in modal
  const [isModalVisible, setModalVisible] = useState(false);  // State to control modal visibility
  const [uploading, setUploading] = useState(false);  // State to handle loading state during image upload

  // Function to open image picker and allow image upload
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
      const selectedImageUri = result.assets[0].uri;  // Use full URI
      console.log("Image URI:", selectedImageUri);  // Log full URI to debug

      try {
        setUploading(true);
        // Pass the full URI to the uploadImage function
        const dataResponse = await uploadImage(selectedImageUri);  // Pass full URI
        console.log("dataResponse:", dataResponse);

        if (dataResponse.url) {
          const updatedGallery = [...localGallery, dataResponse.url];  // Add new image URL to gallery
          setLocalGallery(updatedGallery);  // Update local state
          dispatch(updateGallery(updatedGallery));  // Update Redux state
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);  // Stop uploading state
      }
    }
  };
  const deletePhoto = (uri) => {
    const updatedGallery = localGallery.filter((item) => item !== uri);  // Remove selected image
    setLocalGallery(updatedGallery);
    dispatch(updateGallery(updatedGallery));  // Update Redux state
  };

  const viewImage = (uri) => {
    setSelectedImage(uri);  // Set the selected image
    setModalVisible(true);  // Open the modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Club Gallery</Text>

      {/* Display existing photos */}
      <FlatList
        data={localGallery}
        keyExtractor={(item, index) => `${item}-${index}`} // Ensure unique key
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => viewImage(item)}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePhoto(item)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />

      {/* Upload Photo Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto} disabled={uploading}>
        <Text style={styles.uploadButtonText}>{uploading ? "Uploading..." : "Upload New Photo"}</Text>
      </TouchableOpacity>

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
    backgroundColor: '#e7e7c7',
    // backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#003366',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4444',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
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
