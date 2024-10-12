import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For local storage
import { setEmail, setPassword, setRole, setAuthentication, setUser, setClubId } from '../slices/authSlice';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Image, Dimensions, ImageBackground } from 'react-native';
import SummaryApi from '../backendRoutes';
import Home from './Home';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { email, password, role } = useSelector((state) => state.auth);
  console.log("this is user data", email, password, role);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      Alert.alert('Success', 'Logged in with Google');
      dispatch(setAuthentication(true));
      navigateToRoleScreen(role);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
      // Make a POST request to your backend API for login
      const response = await fetch(SummaryApi.logIn.url, {
        method: SummaryApi.logIn.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      // console.log("user data",data);
      if (data.success===true) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);

        // Set the club ID if the role is club
        if (role === 'club' && data.clubId) { // Ensure clubId exists
          dispatch(setClubId(data.clubId)); // Dispatch action to set clubId
        }

        console.log("login success", data.clubId);
        // Dispatch authentication action
        // dispatch(setAuthentication(true));
        // // Navigate based on role
        navigateToRoleScreen(data);

      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  const navigateToRoleScreen = (data) => {
    navigation.navigate('Home',{data:data});
  };

  return (
    <ImageBackground
      source={{ uri: 'https://www.nikaiacours.fr/wp-content/uploads/2019/12/login-background.jpg' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>

        {/* Add the top image here */}
        <Image
          source={{ uri: 'https://th.bing.com/th?id=OIP.aP1NzCPFoFARQQVD4NrOEgAAAA&w=158&h=142&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2' }}
          style={styles.logoImage}
        />

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => dispatch(setEmail(text))}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => dispatch(setPassword(text))}
          secureTextEntry
        />

        <View style={styles.roleButtonsContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'Student' && styles.selectedRoleButton]}
            onPress={() => dispatch(setRole('Student'))}
          >
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'club' && styles.selectedRoleButton]}
            onPress={() => dispatch(setRole('club'))}
          >
            <Text style={styles.buttonText}>Club</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.selectedRoleButton]}
            onPress={() => dispatch(setRole('admin'))}
          >
            <Text style={styles.buttonText}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Google login button with logo */}
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image
            source={{ uri: 'http://pluspng.com/img-png/google-logo-png-revised-google-logo-1600.png' }}
            style={styles.googleLogo}
          />
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire background
  },
  logoImage: {
    width: 107,
    height: 100,
    alignSelf: 'center',
    marginBottom: 40, // Adjust for spacing
    marginTop: -60,
    borderRadius:20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#07768c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  googleLogo: {
    width: 25,
    height: 23,
    marginRight: 10,
    borderRadius:20,
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedRoleButton: {
    backgroundColor: '#07768c',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signupLink: {
    color: '#003366',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});