// screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, KeyboardAvoidingView, Text} from 'react-native';

function SigninScreen({ navigation }) {
  const [username, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Add validation for password and confirm email/password

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image source={require('./assets/icon.png')} style={styles.logo} />
      <TextInput
        placeholder="userName"
        value={username}
        onChangeText={setuserName}
        style={styles.input}
        placeholderTextColor="#FFFFFF"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#FFFFFF"
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        placeholderTextColor="#FFFFFF"
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
    

      <Button title="Sign Up" onPress={async() => {
        if (password !== confirmPassword) {
          setPasswordError('Passwords do not match.');
        } else {
          setPasswordError('');
        }
        // If everything's okay, proceed with sign-up logic
        if(password === confirmPassword) {
        // Implement sign-up logic here
          // Construct the request payload
          const user = {
            username,
            password, // In a real app, ensure you're handling passwords securely!
          };
          try {
            // Send the POST request
            const response = await fetch('http://192.168.0.157:8080/api/auth/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(user),
            });
        
            const data = await response.json();
            
            if (response.ok) {
              // Handle success response
              console.log('User created:', data);
              // Navigate to another screen or show success message
            } else {
              // Handle server errors or validation errors
              console.error(data.message);
              // You could set an error message state here to display error
            }
          } catch (error) {
            // Handle network errors
            console.error('Network error:', error);
            // Set an error message state here to inform the user
          }
        }
      }} />

      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
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
    marginTop: -100,
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
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});

export default SigninScreen;
