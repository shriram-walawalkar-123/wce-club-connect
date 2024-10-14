import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

const GalleryInfo = ({ route }) => {
  const { clubData } = route.params;
  const gallery = clubData?.gallary;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Split gallery into rows of two images
  const formatGalleryRows = (gallery) => {
    const rows = [];
    for (let i = 0; i < gallery.length; i += 2) {
      rows.push(gallery.slice(i, i + 2)); // Push two images per row
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery o {clubData?.clubName}</Text>
      {gallery?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.galleryContainer}>
          {formatGalleryRows(gallery).map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => openModal(image.url)}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: image.url }} style={styles.galleryImage} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noImagesText}>No images available for this club</Text>
      )}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#003366',
    textAlign: 'center',
  },
  galleryContainer: {
    width: '100%',
    // paddingHorizontal: -10,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space evenly between images
    alignItems:'center',
    paddingHorizontal: 1,
    marginBottom: 20,
  },
  imageWrapper: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,         // Thickness of the border
    borderColor: 'black',
  },
  galleryImage: {
    width: (width * 0.4), // Adjusted width to fit two columns
    height: height * 0.2,
    borderRadius: 10,
    borderWidth: 2,         // Thickness of the border
  },
  noImagesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: width * 0.9,
    height: height * 0.8,
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: 'bold',
  },
});

export default GalleryInfo;
