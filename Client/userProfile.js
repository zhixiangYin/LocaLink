import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, Text, TouchableOpacity, Platform, UIManager} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { getUserId,getUsername,logout} from './auth';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const UserProfile = ({navigation}) => {
  const [imageName, setImagename] = useState(null);
  const [username, setUsername] = useState('');

  // Set inside UserProfile component, for example, at the beginning of the component
  React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <Button onPress={() => navigation.goBack()} title="Return" />
        ),
      });

      async function fetchData() {
        try {
          // Fetching username
          const fetchedUsername = await getUsername();
          setUsername(fetchedUsername);
  
          // Fetching image name
          const userId = await getUserId();
          const response = await fetch(`http://192.168.0.157:8080/api/users/${userId}`);
          const userData = await response.json();
          if (response.ok) {
            setImagename(userData.userProfileImage); // Ensure 'profileImage' is the correct key
          } else {
            console.error('Failed to fetch user data:', userData.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
      
    }, [navigation]);

    const uploadImage = async (image) => {
      const fileType = image.mime.split('/').pop(); // Extracts file extension
      const userId = await getUserId();
      const fileName = `profile-${userId}-${Date.now()}.${fileType}`; // Constructs a unique file name    
      const formData = new FormData();
      formData.append('profileImage', {
        uri: image.path,
        type: image.mime, // Dynamically set type based on file extension
        name: fileName       
      });
    
      try {
        const response = await fetch(`http://192.168.0.157:8080/api/users/${userId}/profile-image`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        const responseData = await response.json();
        if (response.ok) {
          setImagename(responseData);
        } else {
          alert('Failed to upload image: ' + responseData.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      }
    };

    const pickImage = async () => {
      try {
        const image = await ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          cropperCircleOverlay: true,
          compressImageMaxWidth: 300,
          compressImageMaxHeight: 300,
          compressImageQuality: 0.7,
          mediaType: 'photo',
        });   
        await uploadImage(image);       
      } catch (error) {
        console.log(error);
      }
    };
    
    const handleLogout = async () => {
      await logout(); // Call the logout function from auth.js
      navigation.replace('Login'); // Navigate to the LoginScreen
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        
        {imageName ? (
          <Image source={{ uri: `http://192.168.0.157:8080/api/images/${imageName}` }} style={styles.profileImage} />            
        ) : (
          <View style={styles.emptyImage}>
            <Text style={styles.uploadText}>Tap to upload</Text>
          </View>
        )}
        
      </TouchableOpacity>
      <Text style={styles.username}>{username}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={ handleLogout } />
        <Button title="Delete Account" onPress={() => {/* Implement delete account logic here */}} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  imagePicker: {
    marginBottom: 20,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    backgroundColor: '#ddd', // Ensures background is visible
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50, // Make the image itself round
  },
  emptyImage: {
    width: '60%',
    height: '60%',
    backgroundColor: '#ddd', // Example color, change as needed
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
  uploadText: {
    color: '#fff', // Example color for text, change as needed
  },
  username: {
    fontSize: 20,
    color: 'black', // Example color, change as needed
    marginVertical: 10,
  },
 
});

export default UserProfile;
