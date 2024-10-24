import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, ActivityIndicator, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import SummaryApi from '../backendRoutes';
import ContactInfo from '../Modal/contactInfo';
import DescriptionInfo from '../Modal/DescriptionInfo';
import GalleryInfo from '../Modal/galleryInfo';
import MemberInfo from '../Modal/memberInfo';
import PastEventInfo from '../Modal/PastEventInfo';
import UpcommingEventsInfo from '../Modal/UpcommingEventInfo';

const { width } = Dimensions.get('window');

const ClubDetailsScreen = ({ route }) => {
  const { clubId } = route.params;
  const [clubData, setClubData] = useState(null);
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleModal, setVisibleModal] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchClubInfo = async () => {
    try {
      const response = await fetch(SummaryApi.get_club_info.url, {
        method: SummaryApi.get_club_info.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });
      const data = await response.json();
      if (data.success) {
        setClubData(data.data);
      }
    } catch (err) {
      console.error('Error fetching club info:', err);
      setError('Failed to fetch club info.');
    }
  };

  const fetchClubMember = async () => {
    try {
      const response = await fetch(SummaryApi.get_club_member_common.url, {
        method: SummaryApi.get_club_member_common.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });
      const data = await response.json();
      if (data.success) {
        setMember(data.data);
      }
    } catch (err) {
      console.error('Error fetching club members:', err);
      setError('Failed to fetch club members.');
    }
  };

  // Use useFocusEffect to call fetchData when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true); // Show loading indicator
        setError(null); // Reset error state
        try {
          await fetchClubInfo();
          await fetchClubMember();
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('An error occurred while loading data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [clubId]) // Dependency array to ensure fetchData runs when clubId changes
  );

  const showModal = (modalName) => setVisibleModal(modalName);
  const hideModal = () => setVisibleModal(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(53, 114, 239)" />
      </View>
    );
  }

  if (!clubData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Club data not available</Text>
      </View>
    );
  }

  const buttons = [
    { name: 'contact', icon: 'contacts', label: 'Contact Info' },
    { name: 'description', icon: 'information', label: 'Description' },
    { name: 'members', icon: 'account-group', label: 'Members' },
    { name: 'gallery', icon: 'image-multiple', label: 'Gallery' },
    { name: 'upcomingEvents', icon: 'calendar-clock', label: 'Upcoming Events' },
    { name: 'pastEvents', icon: 'calendar-check', label: 'Past Events' },
  ];

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['rgb(5, 12, 156)', 'rgb(53, 114, 239)']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.Image
          source={{ uri: clubData.clubLogo || 'https://via.placeholder.com/150' }}
          style={[styles.logo, {
            transform: [{
              scale: scrollY.interpolate({
                inputRange: [-100, 0, 100],
                outputRange: [1.5, 1, 0.5],
                extrapolate: 'clamp',
              }),
            }],
          }]}
        />
        <Animated.Text style={[styles.title, {
          opacity: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }]}>
          {clubData.clubName} Club
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.buttonContainer}>
          {buttons.map((item, index) => (
            <TouchableOpacity
              key={item.name}
              style={styles.buttonWrapper}
              onPress={() => showModal(item.name)}
            >
              <Surface style={styles.buttonSurface}>
                <LinearGradient
                  colors={['rgb(5, 12, 156)', 'rgb(53, 114, 239)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <IconButton
                    icon={item.icon}
                    color="white"
                    size={32}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonLabel}>{item.label}</Text>
                </LinearGradient>
              </Surface>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Conditional rendering for modals */}
      {visibleModal === 'contact' && <ContactInfo clubData={clubData} onClose={hideModal} />}
      {visibleModal === 'description' && <DescriptionInfo clubData={clubData} onClose={hideModal} />}
      {visibleModal === 'members' && <MemberInfo member={member} onClose={hideModal} />}
      {visibleModal === 'gallery' && <GalleryInfo clubData={clubData} onClose={hideModal} />}
      {visibleModal === 'upcomingEvents' && <UpcommingEventsInfo clubId={clubData.clubId} onClose={hideModal} visible={visibleModal === 'upcomingEvents'} />}
      {visibleModal === 'pastEvents' && <PastEventInfo clubId={clubData.clubId} onClose={hideModal} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContent: {
    paddingTop: 220,
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  buttonWrapper: {
    width: width / 2 - 20,
    marginVertical: 10,
  },
  buttonSurface: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginBottom: 5,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'rgb(5, 12, 156)',
    textAlign: 'center',
  },
});

export default ClubDetailsScreen;