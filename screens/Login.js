import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setEmail, setPassword, setRole, setAuthentication, setUser, setClubId } from '../slices/authSlice';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SummaryApi from '../backendRoutes';

const { width, height } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { email, password, role } = useSelector((state) => state.auth);

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
      const response = await fetch(SummaryApi.logIn.url, {
        method: SummaryApi.logIn.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (data.success === true) {
        await AsyncStorage.setItem('authToken', data.token);
        
        if (role === 'club' && data.clubId) {
          dispatch(setClubId(data.clubId));
        }

        navigateToRoleScreen(data);
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  const navigateToRoleScreen = (data) => {
    navigation.navigate('Home', { data: data });
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
            <Image
              source={{ uri: 'https://th.bing.com/th?id=OIP.aP1NzCPFoFARQQVD4NrOEgAAAA&w=158&h=142&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2' }}
              style={styles.logoImage}
            />

            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#333333" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => dispatch(setEmail(text))}
                placeholderTextColor="#666666"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#333333" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => dispatch(setPassword(text))}
                secureTextEntry
                placeholderTextColor="#666666"
              />
            </View>

            <View style={styles.roleButtonsContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'student' && styles.selectedRoleButton]}
                onPress={() => dispatch(setRole('student'))}
              >
                <Ionicons name="school-outline" size={24} color={role === 'student' ? "#ffffff" : "#333333"} />
                <Text style={[styles.roleButtonText, role === 'student' && styles.selectedRoleButtonText]}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'club' && styles.selectedRoleButton]}
                onPress={() => dispatch(setRole('club'))}
              >
                <Ionicons name="people-outline" size={24} color={role === 'club' ? "#ffffff" : "#333333"} />
                <Text style={[styles.roleButtonText, role === 'club' && styles.selectedRoleButtonText]}>Club</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'admin' && styles.selectedRoleButton]}
                onPress={() => dispatch(setRole('admin'))}
              >
                <Ionicons name="settings-outline" size={24} color={role === 'admin' ? "#ffffff" : "#333333"} />
                <Text style={[styles.roleButtonText, role === 'admin' && styles.selectedRoleButtonText]}>Admin</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
              disabled={!request}
            >
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                style={styles.googleLogo}
              />
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

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
  logoImage: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: 'center',
    marginBottom: height * 0.04,
    borderRadius: width * 0.15,
  },
  title: {
    fontSize: width * 0.08,
    marginBottom: height * 0.03,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333333',
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
  roleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.02,
    margin: width * 0.01,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedRoleButton: {
    backgroundColor: '#4a90e2',
  },
  roleButtonText: {
    marginTop: height * 0.01,
    fontSize: width * 0.03,
    color: '#333333',
  },
  selectedRoleButtonText: {
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#4a90e2',
    padding: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: height * 0.02,
    borderRadius: 5,
    marginBottom: height * 0.02,
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
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#333333',
    fontSize: width * 0.035,
  },
  signupLink: {
    color: '#4a90e2',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginLeft: width * 0.02,
  },
});