import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { setName, setClubName, setEmail, setPassword, setCollegeName, setClubId, toggleSignupMode } from '../slices/authSlice';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Dimensions, Image, ImageBackground } from 'react-native';
import SummaryApi from '../backendRoutes';

const { width, height } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

const Signup = () => {
  const dispatch = useDispatch();
  const {
    isStudentSignup,
    name,
    clubName,
    email,
    password,
    collegeName,
    clubId,
    role,
  } = useSelector((state) => state.auth);
  
  const data = useSelector((state) => state.auth);
  console.log("data" , data);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      Alert.alert('Success', 'Logged in with Google');
      // Handle Google auth success
    }
  }, [response]);

  const handleSignup = async () => {
    try {
      const response = await fetch(SummaryApi.signUp.url, {
        method: SummaryApi.signUp.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, clubName, email, password, collegeName, clubId, role }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Signup successful!');
      } else {
        Alert.alert('Error', result.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred during signup. Please try again.');
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://www.nikaiacours.fr/wp-content/uploads/2019/12/login-background.jpg' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Signup Mode Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => dispatch(toggleSignupMode(true))}>
            <Text style={[styles.toggleButton, isStudentSignup && styles.selectedButton]}>Student Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(toggleSignupMode(false))}>
            <Text style={[styles.toggleButton, !isStudentSignup && styles.selectedButton]}>Admin Signup</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{isStudentSignup ? 'Student Signup' : 'Admin Signup'}</Text>

        {/* Common fields for both Student and Admin */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => dispatch(setName(text))}
        />

        {!isStudentSignup && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Club Name"
              value={clubName}
              onChangeText={(text) => dispatch(setClubName(text))}
            />
            <TextInput
              style={styles.input}
              placeholder="Club ID"
              value={clubId}
              onChangeText={(text) => dispatch(setClubId(text))}
            />
          </>
        )}

        {isStudentSignup && (
          <TextInput
            style={styles.input}
            placeholder="Name of College"
            value={collegeName}
            onChangeText={(text) => dispatch(setCollegeName(text))}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => dispatch(setEmail(text))}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => dispatch(setPassword(text))}
          secureTextEntry
        />

        <Button title="Signup" onPress={handleSignup} />

        {/* Google Signup only for students */}
        {isStudentSignup && (
          <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
            <Image 
              source={{ uri: 'http://pluspng.com/img-png/google-logo-png-revised-google-logo-1600.png' }} 
              style={styles.googleLogo} 
            />
            <Text style={styles.googleButtonText}>Signup with Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Make transparent
    
  },
  title: {
    fontSize: width * 0.06,
    marginBottom: height * 0.02,
    textAlign: 'center',
    fontStyle:'italic',
  },
  input: {
    borderWidth: 1,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    borderRadius: 5,
    backgroundColor: '#fff',
    
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.02,
    
  },
  toggleButton: {
    fontSize: width * 0.045,
    marginHorizontal: width * 0.05,
    padding: width * 0.02,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    
  },
  selectedButton: {
    color:'#1e90ff',
    borderColor: '#dedeaf',
    fontWeight: 'bold',
    fontStyle:'italic',
  },
  googleButton: {
    marginTop: height * 0.03,
    padding: width * 0.04,
    backgroundColor: '#07768c',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 25,
    height: 23,
    marginRight: width * 0.02,
    borderRadius:20,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default Signup;