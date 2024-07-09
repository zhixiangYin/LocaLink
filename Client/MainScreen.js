// MapScreen.js
import React,{useState, useEffect,useCallback, useRef}from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Image, Animated} from 'react-native';
import MapboxGL, { Camera } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { getUserId} from './auth';
import { useFocusEffect } from '@react-navigation/native';


MapboxGL.setAccessToken('pk.eyJ1IjoiemhpeGlhbmcxMTEiLCJhIjoiY2x2NzIxaWE1MDU0NjJqb2FuMzN4NGZ1bCJ9.ShPyuLCkJ4FdjR6A5-IYpg');

const defaultUserIcon = require('./assets/userImage.png'); // Path to your default image

const MainScreen = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [userIcon, setUserIcon] = useState(defaultUserIcon);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [manualCenter, setManualCenter] = useState(null);
  
  const loadCustomIcon = async () => {
    const userId = await getUserId();
    const response = await fetch(`http://192.168.0.157:8080/api/users/${userId}`);
    const userData = await response.json();
    if (response.ok) {
      const imageUrl = `http://192.168.0.157:8080/api/images/${userData.userProfileImage}`;
      console.log("Image URL:", imageUrl);
      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) {
        // Compare the new URL with the current one
        if (userIcon.uri !== imageUrl) {
          setUserIcon({ uri: imageUrl });
        }
        console.log("Custom icon set:", imageUrl);
      } else {
        //console.error('Failed to load image:', imageUrl);
        setUserIcon(defaultUserIcon);
      }
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      loadCustomIcon();
    },[userIcon])
  );

  useEffect(() => {
    let subscriber;
    async function watchLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      subscriber = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 100,
        distanceInterval: 0.001,  // Ensures updates on small movements
      }, (newLocation) => {
        //console.log(newLocation);
        setLocation(newLocation.coords);
        if (followUserLocation) {
          setManualCenter([newLocation.coords.longitude, newLocation.coords.latitude]);
        }
      });
    }
  
    watchLocation();
  
    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [followUserLocation]);

  const goToUserProfile = () => {
    // Assuming 'UserProfile' is the route name of the user profile screen
    navigation.navigate('userProfile');
  };

  //console.log(followUserLocation);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToUserProfile} style={styles.profileButton}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      {location && (
        <MapboxGL.MapView 
          style={styles.map} 
          styleURL={MapboxGL.StyleURL.Street}
          scaleBarEnabled={false}
          pitchEnabled={true}
          logoEnabled={false}
          onTouchStart={()=>setFollowUserLocation(false)}
          //deselectAnnotationOnTap={true}
        >
          <MapboxGL.Camera
            centerCoordinate={manualCenter || [-0.118092, 51.509865]}
            animationMode={"linearTo"}
            animationDuration={2000}
            //followZoomLevel={17}
            followPitch = {65}                    
            followUserMode="compass"
            followUserLocation={followUserLocation}
            minZoomLevel={5}
            maxZoomLevel={20}          
          />
          <MapboxGL.FillExtrusionLayer
            id="3d-buildings"
            sourceLayerID="building"
            filter={['==', 'extrude', 'true']} // Ensure only extrudable buildings are rendered
            style={{
             'fillExtrusionColor': '#aaaaaa',
             'fillExtrusionHeight': [
                 "get", "height"
             ],
             'fillExtrusionBase': [
                 "get", "min_height"
             ],
             'fillExtrusionOpacity': 0.6
            }}
         />
             
          <MapboxGL.PointAnnotation
            ref={ref => (this.markerRef = ref)}
            id="userLocationAnnotation"
            coordinate={[location.longitude, location.latitude]}
            onSelected={()=>{
              setFollowUserLocation(true);
            }}                 
          >        
            <View style={styles.annotationContainer}>
              <Image
                source={userIcon}
                style={styles.annotationImage}
                onLoad={() => this.markerRef.refresh()}
              />
            </View>                   
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>             
      )}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    zIndex: 1, // ensure the button is above the map
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  annotationContainer: {
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: 'center',
    borderWidth: 0,
    borderColor:'#006400',
    backgroundColor: 'green', // Ensures background is visible
    alignItems: 'center',
  },
  annotationImage: {
    borderRadius: 50,
    width: '90%',
    height: '90%',
  },
});
