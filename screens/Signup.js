import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { setName, setClubName, setEmail, setPassword, setCollegeName, setClubId, toggleSignupMode } from '../slices/authSlice';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
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
    CollegeName,
    clubId,
  } = useSelector((state) => state.auth);
  const data=useSelector((state) => state.auth)
  // console.log("usre data is here:",data);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      Alert.alert('Success', 'Logged in with Google');
      // Dispatch authentication state changes if needed
    }
  }, [response]);

  const handleSignup = async () => {
    try {
        const response = await fetch(SummaryApi.signUp.url, {
            method: SummaryApi.signUp.method,
            credentials:"include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            Alert.alert('Success', 'Signup successful!');
        } else {
            Alert.alert('Error', result.message || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Signup error:', error); // Log the error for debugging
        Alert.alert('Error', 'An error occurred during signup. Please try again.');
    }
};


  return (
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

      {/* Conditional fields for Student Signup */}
      {isStudentSignup && (
        <TextInput
          style={styles.input}
          placeholder="Name of College"
          value={CollegeName}
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
          <Text style={styles.googleButtonText}>Signup with Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.05, // Responsive padding
    backgroundColor: 'rgba(255, 255, 255, 0)', // Slightly more opaque background for readability
  },
  title: {
    fontSize: width * 0.06, // Responsive font size
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: width * 0.03, // Responsive padding
    marginBottom: height * 0.02, // Responsive margin
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  toggleButton: {
    fontSize: width * 0.045, // Responsive font size
    marginHorizontal: width * 0.05,
    padding: width * 0.02,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    borderColor: '#dedeaf',
    fontWeight: 'bold',
  },
  googleButton: {
    marginTop: height * 0.03, // Responsive margin
    padding: width * 0.04,
    backgroundColor: '#07768c',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
    marginLeft: width * 0.02, // Responsive margin between logo and text
  },
});

export default Signup;
