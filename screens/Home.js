import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Platform, ImageBackground } from 'react-native';
import { clubs } from '../ClubData'; 

const { width, height } = Dimensions.get('window'); // Get device dimensions

const Home = ({ navigation }) => {
  const [clubs, setClubs] = useState([]); // State variable to hold club data


  const fetchAllClubs = async () => {
    try {
      const response = await fetch(SummaryApi.get_all_club.url);
      const data = await response.json(); // Parse the response as JSON
      // console.log("data",data);
      setClubs(data.clubs); // Store the fetched data in the state
    } catch (err) {
      console.error("Error in fetchAllClubs:", err);
    }
  };
  useEffect(() => {
    fetchAllClubs(); // Fetch clubs data when the component mounts
  }, []); // Empty dependency array to run only once

  return (
    <ImageBackground
          source={{ uri: 'https://www.nikaiacours.fr/wp-content/uploads/2019/12/login-background.jpg' }} 
          style={styles.backgroundImage}
        >
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://th.bing.com/th?id=OIP.aP1NzCPFoFARQQVD4NrOEgAAAA&w=158&h=142&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2' }}
          style={styles.logo}
        />

        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('UpcomingEventsScreen')}>
            <Text style={styles.navText}>Upcoming Events</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PastEvents')}>
            <Text style={styles.navText}>Past Events</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>WCE COLLEGE CLUBS</Text>

        {/* ScrollView to contain all clubs */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {clubs?.map((club) => (
            <TouchableOpacity key={club._id} onPress={() => navigation.navigate('ClubDetailsScreen', { clubId: club._id })}>
              <View style={styles.clubCard}>
                <Text style={styles.clubText}>{club.clubName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width > 600 ? 18 : 16,
  },
  navBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  navText: {
    marginHorizontal: 10,
    fontSize: width > 600 ? 20 : 18,
    color: '#dedeaf',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: width > 600 ? 24 : 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
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
    marginBottom: 10, // Space between cards
    paddingHorizontal: 4,
    shadowRadius: 6,
    elevation: 6,
    width: width * 0.8, // Adjust width as needed
  },
  clubText: {
    fontSize: width > 600 ? 18 : 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default Home;
