import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform,ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';
import uploadImage from '../helper/uploadImage';

const { width, height } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

const Signup = () => {
  const navigation = useNavigation();
  const [isStudentSignup, setIsStudentSignup] = useState(true);
  const [name, setName] = useState('');
  const [clubName, setClubName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [clubId, setClubId] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false); // Added state for loader


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

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable the crop option
      quality: 1,
      selectionLimit: 0, // 0 means unlimited selection
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    setLoading(true); // Set loading to true when signup is initiated
    try {
      let uploadedImageUrl = null;

      if (profileImage) {
        uploadedImageUrl = await uploadImage(profileImage);
      }

      const response = await fetch(SummaryApi.signUp.url, {
        method: SummaryApi.signUp.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          clubName,
          email,
          password,
          collegeName,
          clubId,
          role: isStudentSignup ? "student" : "club",
          profilepic: uploadedImageUrl?.secure_url,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Signup successful!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', result.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when signup is complete
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://www.nikaiacours.fr/wp-content/uploads/2019/12/login-background.jpg' }}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            style={styles.formContainer}
          >
            <Text style={styles.title}>Sign Up</Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isStudentSignup && styles.activeToggle]}
                onPress={() => setIsStudentSignup(true)}
              >
                <Ionicons name="school-outline" size={24} color={isStudentSignup ? "#ffffff" : "#333333"} />
                <Text style={[styles.toggleText, isStudentSignup && styles.activeToggleText]}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isStudentSignup && styles.activeToggle]}
                onPress={() => setIsStudentSignup(false)}
              >
                <Ionicons name="business-outline" size={24} color={!isStudentSignup ? "#ffffff" : "#333333"} />
                <Text style={[styles.toggleText, !isStudentSignup && styles.activeToggleText]}>Admin</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#333333" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#666666"
              />
            </View>

            {!isStudentSignup && (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons name="business-outline" size={24} color="#333333" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Club Name"
                    value={clubName}
                    onChangeText={setClubName}
                    placeholderTextColor="#666666"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="card-outline" size={24} color="#333333" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Club ID"
                    value={clubId}
                    onChangeText={setClubId}
                    placeholderTextColor="#666666"
                  />
                </View>
              </>
            )}

            {isStudentSignup && (
              <View style={styles.inputContainer}>
                <Ionicons name="school-outline" size={24} color="#333333" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Name of College"
                  value={collegeName}
                  onChangeText={setCollegeName}
                  placeholderTextColor="#666666"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#333333" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#666666"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#333333" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#666666"
              />
            </View>

            <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerButton}>
              <Ionicons name="camera-outline" size={24} color="#ffffff" />
              <Text style={styles.imagePickerButtonText}>Upload Profile Image</Text>
            </TouchableOpacity>

            {profileImage && (
              <Image source={{ uri: profileImage }} style={styles.imagePreview} />
            )}

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
              {loading ? ( // Display loader when loading is true
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {isStudentSignup && (
              <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleButtonText}>Sign up with Google</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: width * 0.05,
  },
  formContainer: {
    padding: width * 0.05,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: width * 0.08,
    marginBottom: height * 0.03,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: width * 0.02,
  },
  activeToggle: {
    backgroundColor: '#4a90e2',
  },
  toggleText: {
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333333',
  },
  activeToggleText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  inputIcon: {
    padding: width * 0.03,
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.015,
    paddingRight: width * 0.03,
    fontSize: width * 0.04,
    color: '#333333',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
    padding: width * 0.04,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  imagePickerButtonText: {
    color: '#ffffff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginLeft: width * 0.02,
  },
  imagePreview: {
    width: width * 0.3,
    height: width * 0.3,
    marginTop: height * 0.02,
    borderRadius: width * 0.15,
    alignSelf: 'center',
  },
  signupButton: {
    marginTop: height * 0.03,
    padding: width * 0.04,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  googleButton: {
    marginTop: height * 0.02,
    padding: width * 0.04,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  googleLogo: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },
  googleButtonText: {
    color: '#333333',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default Signup;