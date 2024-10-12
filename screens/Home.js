import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import SummaryApi from '../backendRoutes';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation, route }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    profileImage: 'https://via.placeholder.com/150',
    role: '',
  });

  const { data } = route.params || {};

  useEffect(() => {
    if (data) {
      setLoggedIn(true);
      setProfileData({
        username: data.username,
        profileImage: data.profileImage || 'https://via.placeholder.com/150',
        role: data.role,
      });
    }
  }, [data]);

  const fetchAllClubs = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.get_all_club.url);
      const data = await response.json();
      setClubs(data.clubs);
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
    });
    setClubs([]);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  return (
    <ImageBackground
      source={{ uri: 'https://www.nikaiacours.fr/wp-content/uploads/2019/12/login-background.jpg' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Single-line header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://th.bing.com/th?id=OIP.aP1NzCPFoFARQQVD4NrOEgAAAA&w=158&h=142&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2' }}
            style={styles.logo}
          />
          {loggedIn ? (
            <>
              <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
              <Text style={styles.username}>{profileData.username}</Text>
              <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
              {profileData.role === 'club' && (
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('ClubOptionsScreen')}>
                  <Text style={styles.buttonText}>Club Page</Text>
                </TouchableOpacity>
              )}
              {profileData.role === 'admin' && (
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('AdminPage')}>
                  <Text style={styles.buttonText}>Admin Page</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.heading}>WCE COLLEGE CLUBS</Text>

        {/* Navigation bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('UpcomingEventsScreen')}>
            <Text style={styles.navText}>Upcoming Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PastEvents')}>
            <Text style={styles.navText}>Past Events</Text>
          </TouchableOpacity>
        </View>

        {/* Loading indicator and club list */}
        {loading ? (
          <ActivityIndicator size="large" color="#003366" style={styles.loadingIndicator} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {clubs.length > 0 ? (
              clubs.map((club) => (
                <TouchableOpacity key={club._id} onPress={() => navigation.navigate('ClubDetailsScreen', { clubId: club._id })}>
                  <View style={styles.clubCard}>
                    <Text style={styles.clubText}>{club.clubName}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noClubsContainer}>
                <Text style={styles.noClubsText}>No clubs available.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    padding: 16,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#003366', // Add background to header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  logo: {
    width: 40, // Adjust logo size for better fit
    height: 40,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: 'white', // Make text white for contrast
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  headerButton: {
    backgroundColor: '#FF3B30', // Change the button color if necessary
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
    marginTop: 20, // Add space between header and heading
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#0055FF', // Differentiate nav buttons from header
    padding: 10,
    borderRadius: 10,
  },
  navText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  clubCard: {
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center text inside the club card
    marginBottom: 10,
    paddingHorizontal: 4,
    shadowRadius: 6,
    elevation: 6,
    width: width * 0.8,
  },
  clubText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  noClubsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noClubsText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Home;
