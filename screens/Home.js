import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';
import UserDetailsModal from '../Modal/UserDetailsModal';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation, route }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    profileImage: 'https://via.placeholder.com/150',
    role: '',
    email: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const { data } = route.params || {};

  useEffect(() => {
    if (data) {
      setLoggedIn(true);
      setProfileData({
        username: data.name,
        profileImage: data.profilepic || 'https://via.placeholder.com/150',
        role: data.role,
        email: data.email,
      });
    }
  }, [data]);

  const fetchAllClubs = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.get_all_club.url);
      const data = await response.json();
      if (data.success) {
        setClubs(data.clubs);
      } else {
        console.error("Failed to fetch clubs:", data.message);
      }
    } catch (err) {
      console.error("Error in fetchAllClubs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllClubs();
  }, [fetchAllClubs]);

  const handleLogout = useCallback(() => {
    setLoggedIn(false);
    setProfileData({
      username: '',
      profileImage: 'https://via.placeholder.com/150',
      role: '',
      email: '',
    });
  }, []);

  const renderClubItem = ({ item }) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => navigation.navigate('ClubDetailsScreen', { clubId: item._id })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.clubGradient}
      >
        <Image source={{ uri: item.profilepic }} style={styles.clubIcon} />
        <Text style={styles.clubText}>{item.clubName}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1495510091154-4581df8e2b1f' }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
        style={styles.gradientOverlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://th.bing.com/th?id=OIP.aP1NzCPFoFARQQVD4NrOEgAAAA&w=158&h=142&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2' }}
              style={styles.logo}
            />
            {loggedIn ? (
              <View style={styles.profileContainer}>
                <TouchableOpacity onPress={toggleModal}>
                  <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
                {profileData.role === 'club' && (
                  <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("ClubOptionsScreen")}>
                    <MaterialCommunityIcons name="office-building" size={24} color="white" />
                  </TouchableOpacity>
                )}
                {profileData.role === 'admin' && (
                  <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('AdminScreen', { clubs })}>
                    <Ionicons name="settings-outline" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Ionicons name="log-in-outline" size={24} color="white" />
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Heading */}
          <Text style={styles.heading}>WCE College</Text>

          {/* Navigation bar */}
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('UpcomingEventsScreen')}>
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.navButtonGradient}
              >
                <Ionicons name="calendar-outline" size={24} color="white" />
                <Text style={styles.navText}>Upcoming Events</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PastEventsScreen')}>
              <LinearGradient
                colors={['#11998e', '#38ef7d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.navButtonGradient}
              >
                <Ionicons name="time-outline" size={24} color="white" />
                <Text style={styles.navText}>Past Events</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Loading indicator and club list */}
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
          ) : (
            <FlatList
              data={clubs}
              renderItem={renderClubItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.clubList}
              numColumns={width > 600 ? 2 : 1}
              ListEmptyComponent={
                <View style={styles.noClubsContainer}>
                  <Text style={styles.noClubsText}>No clubs available.</Text>
                </View>
              }
            />
          )}

          {/* User Details Modal */}
          <UserDetailsModal
            visible={modalVisible}
            onClose={toggleModal}
            userData={profileData}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  logo: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: 'contain',
    borderRadius: width * 0.06,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: width * 0.06,
    padding: width * 0.01,
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    borderWidth: 2,
    borderColor: 'white',
    marginHorizontal: width * 0.02,
  },
  headerButton: {
    padding: width * 0.02,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: width * 0.02,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.05,
  },
  loginButtonText: {
    color: 'white',
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
  },
  heading: {
    fontSize: width * 0.06,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  navButton: {
    flex: 1,
    marginHorizontal: width * 0.01,
    borderRadius: width * 0.05,
    overflow: 'hidden',
  },
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
  },
  navText: {
    color: 'white',
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  clubList: {
    paddingBottom: height * 0.02,
  },
  clubCard: {
    flex: 1,
    margin: width * 0.02,
    borderRadius: width * 0.04,
    overflow: 'hidden',
  },
  clubGradient: {
    padding: width * 0.05,
    borderRadius: width * 0.04,
    alignItems: 'center',
  },
  clubIcon: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginBottom: height * 0.01,
  },
  clubText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noClubsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  noClubsText: {
    color: 'white',
    fontSize: width * 0.045,
  },
});

export default Home;
