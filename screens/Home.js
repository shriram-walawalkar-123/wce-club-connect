import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
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
    email: ''
  });

  const [modalVisible, setModalVisible] = useState(false);
  const { data } = route.params || {};
  // console.log("data in home",data);
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
      // console.log("club dekho ",data);
      if(data.success===true){
        setClubs(data.clubs);
      }
    } catch (err) {
      console.error("Error in fetchAllClubs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllClubs();
  }, [data]);

  const handleLogout = useCallback(() => {
    setLoggedIn(false);
    setProfileData({
      username: '',
      profileImage: 'https://via.placeholder.com/150',
      role: '',
      email: '',
    });
  }, [navigation]);

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
        <FontAwesome5 name="users" size={32} color="white" style={styles.clubIcon} />
        <Text style={styles.clubText}>{item.clubName}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
                  <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('AdminScreen', { clubs: clubs })}>
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
                <Ionicons name="calendar-outline" size={28} color="white" />
                <Text style={styles.navText}>Upcoming Events</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PastEvents')}>
              <LinearGradient
                colors={['#11998e', '#38ef7d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.navButtonGradient}
              >
                <Ionicons name="time-outline" size={28} color="white" />
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 25,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    marginHorizontal: 8,
  },
  headerButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 8,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    height:70,
  },
  navText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 50,
  },
  clubList: {
    paddingBottom: 50,
  },
  clubCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 5,
    overflow: 'hidden',
  },
  clubGradient: {
    paddingVertical: 25,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubIcon: {
    marginBottom: 15,
  },
  clubText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noClubsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noClubsText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Home;