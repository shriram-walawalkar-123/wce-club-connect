import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import SummaryApi from '../backendRoutes';
import RegisterEvent from '../Modal/RegisterEvent';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = width * 0.72;
const SPACING = 10;
const FULL_SIZE = ITEM_SIZE + SPACING * 2;

const UpcomingEventsScreen= () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(SummaryApi.get_all_upcomming_events.url, {
        method: SummaryApi.get_all_upcomming_events.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if(data.success===true){
        setUpcomingEvents([{ key: 'left-spacer' }, ...data.data, { key: 'right-spacer' }]);
      }else{
        Alert("error to get events");
      }
    } catch (error) {
      console.error('Error fetching events:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const openRegisterEventModal = (event) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeRegisterEventModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const renderItem = ({ item, index }) => {
    if (!item.eventName) {
      return <View style={{ width: SPACING }} />;
    }

    const inputRange = [
      (index - 2) * FULL_SIZE,
      (index - 1) * FULL_SIZE,
      index * FULL_SIZE,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [0, -50, 0],
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
    });

    return (
      <Animated.View
        style={[
          styles.eventContainer,
          { transform: [{ translateY }, { scale }], opacity },
        ]}
      >
        <LinearGradient
          colors={['#6C63FF', '#4CAF50']}
          style={styles.gradientBackground}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('showEvent', { event: item })}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.eventPoster }} style={styles.eventImage} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.eventName}>{item.eventName}</Text>
              <Text style={styles.eventDate}>
                {new Date(item.eventDate).toLocaleDateString()}
              </Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => openRegisterEventModal(item)}
              >
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={upcomingEvents}
        keyExtractor={(item) => item.id || item.key}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={FULL_SIZE}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRegisterEventModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <RegisterEvent event={selectedEvent} onClose={closeRegisterEventModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  eventContainer: {
    width: ITEM_SIZE,
    height: height * 0.7,
    marginHorizontal: SPACING,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 24,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    padding: 10,
    margin: 2,
  },
  imageContainer: {
    height: '60%',
    marginBottom: 10,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  detailsContainer: {
    padding: 10,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
  },
});

export default UpcomingEventsScreen;