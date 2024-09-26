import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { clubs } from '../ClubData'; 

export default function Home({ navigation }) {
  return (
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

      <Text style={styles.heading}>WCE College Clubs</Text>
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
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  loginButton: {
    backgroundColor: '#007AFF',
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
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  navText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    height:150,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 1,
    marginHorizontal: 8,
    paddingHorizontal:4,
    shadowRadius: 6,
    elevation: 6,
    width: 150, 
  },
  clubImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  clubText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
