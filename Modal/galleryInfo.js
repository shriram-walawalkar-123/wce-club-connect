import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const scaleFontSize = (size) => {
  const screenWidth = width;
  if (screenWidth > 400) {
    return size * 1.3;
  }
  return size;
};

const GalleryInfo = ({ clubData, isVisible, onClose }) => {
  const gallery = clubData?.gallary || [];
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState({});

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const handleImageLoad = (imageId) => {
    setImageLoading((prev) => ({ ...prev, [imageId]: false }));
  };

  if (!gallery || gallery.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>No Images Available</Text>
      </SafeAreaView>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContent}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            <Text style={styles.header}>Gallery</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.imageGrid}>
                {gallery.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => openImage(item.url)}
                    style={styles.imageContainer}
                  >
                    <LinearGradient
                      colors={['#E6F3FF', '#B0C4DE', '#778899']}
                      style={styles.imageGradient}
                    >
                      {imageLoading[item._id] !== false && (
                        <ActivityIndicator style={styles.loadingIndicator} color="#4e545c" />
                      )}
                      <Image
                        source={{ uri: item.url }}
                        style={styles.image}
                        onLoad={() => handleImageLoad(item._id)}
                        onError={() => handleImageLoad(item._id)}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close Gallery</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      {selectedImage && (
        <Modal visible={true} transparent={true} onRequestClose={closeImage}>
          <View style={styles.enlargedImageContainer}>
            <TouchableOpacity onPress={closeImage} style={styles.enlargedImageCloseButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={styles.enlargedImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom:130,
    paddingBottom:1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  safeArea: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.75, // Use 75% of the screen height for the modal
    marginBottom: 0,
    paddingBottom: 20,
  },
  modalContent: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E8E8',
    borderRadius: 3,
  },
  scrollViewContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 20,
  },
  header: {
    fontSize: scaleFontSize(26),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#E5E8E8',
    marginVertical: height * 0.02,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: width * 0.43,
    height: width * 0.43,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  enlargedImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedImageCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: scaleFontSize(28),
    color: '#E5E8E8',
    fontWeight: 'bold',
  },
  enlargedImage: {
    width: '90%',
    height: '90%',
  },
  closeButton: {
    backgroundColor: '#F95454',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: scaleFontSize(18),
  },
});

export default GalleryInfo;
