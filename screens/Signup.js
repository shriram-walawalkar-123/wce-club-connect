import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Signup = () => {
  const [isStudentSignup, setIsStudentSignup] = useState(true); // Toggle between Student and Admin
  const [name, setName] = useState('');
  const [clubName,setClubName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collageName, setCollageName] = useState('');
  const [clubId,setClubId] = useState();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  const handleSignup = () => {
    if (isStudentSignup) {
      Alert.alert('Student Signup', 'Student signup logic goes here.');
    } else {
      Alert.alert('Admin Signup', 'Admin signup logic goes here.');
    }
  };

  // Handle Google signup for students
  const handleGoogleSignup = () => {
    promptAsync();
  };

  // If Google authentication is successful
  if (response?.type === 'success') {
    Alert.alert('Success', 'Logged in with Google');
  }

  return (
    <View style={styles.container}>
      {/* Signup Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setIsStudentSignup(true)}>
          <Text style={[styles.toggleButton, isStudentSignup && styles.selectedButton]}>Student Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsStudentSignup(false)}>
          <Text style={[styles.toggleButton, !isStudentSignup && styles.selectedButton]}>Admin Signup</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{isStudentSignup ? 'Student Signup' : 'Admin Signup'}</Text>

      {/* Common fields for both Student and Admin */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      {
        !isStudentSignup && (
          <>
      <TextInput
        style={styles.input}
        placeholder="club Name"
        value={clubName}
        onChangeText={setClubName}
      />

      <TextInput
        style={styles.input}
        placeholder="club id"
        value={clubId}
        onChangeText={setClubId}
      />

    </>
        )
      }
      

      {/* Conditional fields for Student Signup */}
      {isStudentSignup && (
        <>

          <TextInput
            style={styles.input}
            placeholder="Name of College"
            value={collageName}
            onChangeText={setCollageName}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Signup" onPress={handleSignup} />

      {/* Google Signup only for students */}
      {isStudentSignup && (
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup}>
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
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    fontSize: 18,
    marginHorizontal: 20,
    padding: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    borderColor: '#6200EE',
    fontWeight: 'bold',
  },
  googleButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#DB4437',
    borderRadius: 5,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup;
