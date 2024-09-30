import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');  

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
      navigateToRoleScreen(role);
    }
  }, [response]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    Alert.alert('Success', `Logged in as ${role}`);
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
    <ImageBackground
      source={{ uri: 'https://www.nikaiacours.fr/wp-content/uploads/2019/12/login-background.jpg' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View>
          <Image
            source={{ uri: 'https://th.bing.com/th?id=OIP.aP1NzCPFoFARQQVD4NrOEgAAAA&w=158&h=142&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2' }}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Role Selection Buttons */}
        <Text style={styles.label}>Select Role:</Text>
        <View style={styles.roleButtonsContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'Student' && styles.selectedRoleButton]}
            onPress={() => setRole('Student')}
          >
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'Club Admin' && styles.selectedRoleButton]}
            onPress={() => setRole('Club Admin')}
          >
            <Text style={styles.buttonText}>Club Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'Administrator' && styles.selectedRoleButton]}
            onPress={() => setRole('Administrator')}
          >
            <Text style={styles.buttonText}>Administrator</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => {
            promptAsync();
          }}
          disabled={!request}
        >
          <Image
            source={{ uri: 'https://bulldogdigitalmedia.co.uk/wp-content/uploads/2019/03/image-12.jpg' }}
            style={styles.googleIcon}
          />
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>

        {/* Signup and Forgot Password Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
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
