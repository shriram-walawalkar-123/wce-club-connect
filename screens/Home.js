import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Platform, ImageBackground } from 'react-native';
import { clubs } from '../ClubData'; 

const { width, height } = Dimensions.get('window'); // Get device dimensions

export default function Home({ navigation }) {
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
          <TouchableOpacity onPress={() => navigation.navigate('UpcomingEvents')}>
            <Text style={styles.navText}>Upcoming Events</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PastEvents')}>
            <Text style={styles.navText}>Past Events</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>WCE COLLEGE CLUBS</Text>
        <FlatList
          data={clubs} 
          key={'two-columns'}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ClubDetails', { clubId: item.id })}> 
              <View style={styles.clubCard}>
                <Image source={{ uri: item.image }} style={styles.clubImage} />
                <Text style={styles.clubText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={width > 600 ? 3 : 2} // Dynamically change the number of columns based on device width
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
      </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)', // To make the content stand out on the background
    padding: 16,
    alignItems: 'center',
  },
  image:{
    borderRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire background
  },
  logo: {
    width: width * 0.4, // Adjust logo width based on device size
    height: width * 0.4, // Maintain aspect ratio
    marginBottom: 20,
    resizeMode: 'contain',
    borderRadius:10,
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
    fontSize: width > 600 ? 18 : 16, // Adjust font size for larger screens
  },
  navBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  navText: {
    marginHorizontal: 10,
    fontSize: width > 600 ? 20 : 18, // Adjust font size for larger screens
    color: '#dedeaf',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: width > 600 ? 24 : 22, // Adjust heading size
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
  },
  flatListContent: {
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  clubCard: {
    // boxSizing: borderBox,
    height: 150,
    backgroundColor: '#FFFFFF',
    // backgroundColor: 'rgb(33,122,122)',
    // backgroundColor: 'linear-gradient(90deg, rgba(33,122,122,1) 25%, rgba(205,205,187,1) 51%, rgba(107,48,95,1) 79%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 1,
    marginHorizontal: 8,
    paddingHorizontal: 4,
    shadowRadius: 6,
    elevation: 6,
    width: width * 0.4, // Make the width of the club card responsive
  },
  clubImage: {
    width: '80%',
    height: '60%',
    borderRadius: 10,
    marginBottom: 1,
    marginTop:7,
    resizeMode: 'contain',
  },
  clubText: {
    resizeMode: 'contain',
    fontSize: width > 600 ? 18 : 16, // Adjust text size for larger screens
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});