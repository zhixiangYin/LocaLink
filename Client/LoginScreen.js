// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, KeyboardAvoidingView, Alert} from 'react-native';
import { saveUserId,saveUsername } from './auth';

async function loginUser(credentials, navigation) {
  try {
    const response = await fetch('http://192.168.0.157:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the token using AsyncStorage or your preferred method
      // AsyncStorage.setItem('userToken', data.accessToken);
      await saveUserId(data.id); // Save the user ID
      await saveUsername(data.username);
      // Navigate to the user profile screen
      navigation.navigate('MainScreen', { user: data });
    } else {
      // Handle errors, show user feedback
      Alert.alert('Login Failed', data.message);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Login Error', 'An error occurred during login, please try again.');
  }
}


function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (  
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image source={require('./assets/icon.png')} style={styles.logo} />
      <TextInput
          placeholder="username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#FFFFFF"
      />
      <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#FFFFFF"
      />
      <Button title="Login" onPress={() => loginUser({ username, password }, navigation)} />
      <Button
          title="Don't have an account? Sign Up"
          onPress={() => navigation.navigate('Signin')}
      />
    </KeyboardAvoidingView>     
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 20,
    padding: 10,
    color: '#FFFFFF', // White text color
    borderRadius: 15,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default LoginScreen;
