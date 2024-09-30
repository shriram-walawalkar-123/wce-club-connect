import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { setEmail, setPassword, setRole, setAuthentication, setUser } from '../slices/authSlice';
const { width, height } = Dimensions.get('window');
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground, Dimensions, Platform } from 'react-native';


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

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    Alert.alert('Success', `Logged in as ${role}`);
    dispatch(setAuthentication(true));
    navigateToRoleScreen(role);
  };

  const navigateToRoleScreen = (role) => {
    if (role === 'Student') {
      navigation.navigate('StudentDashboard');
    } else if (role === 'Club Admin') {
      navigation.navigate('ClubAdminDashboard');
    } else if (role === 'Administrator') {
      navigation.navigate('AdminDashboard');
    }
  };

  return (
    <View style={styles.container}>
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
          style={[styles.roleButton, role === 'Club Admin' && styles.selectedRoleButton]}
          onPress={() => dispatch(setRole('Club Admin'))}
        >
          <Text style={styles.buttonText}>Club Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Administrator' && styles.selectedRoleButton]}
          onPress={() => dispatch(setRole('Administrator'))}
        >
          <Text style={styles.buttonText}>Administrator</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>

      {/* New Signup Link */}
      <View style={styles.footerLinks}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // This will scale the image appropriately
    justifyContent: 'center',
  },
  logo: {
    // marginTop:100,
    height: 100,
    width: 100,
    padding:50,
    marginHorizontal: 130,
    marginTop: -120,
    borderRadius: 50,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Semi-transparent background for readability
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
  googleIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
    borderRadius:40
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkText: {
    color: '#003366',
    fontSize: 16,
    textDecorationLine: 'underline',
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
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});
