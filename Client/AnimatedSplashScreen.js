import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';

// Make sure to install lottie-react-native using expo install lottie-react-native

export default function AnimatedSplashScreen({ navigation }) {
  useEffect(() => {
    // Start the animation when the component is mounted
    // Assuming the animation is included in your project and named 'splash-animation.json'
    // You might want to use a different animation and therefore should change the source

    // Simulate loading resources by using a timeout
    // In a real app, you'd replace this with your actual loading logic
    const timer = setTimeout(() => {
      navigation.navigate('Login'); // Navigate to the LoginScreen after the "loading" is done
    }, 5000); // The timeout duration could be the length of your animation

    return () => clearTimeout(timer); // Cleanup the timer when the component is unmounted
  }, [navigation]);

  return (
    <View style={styles.animationContainer}>
      <StatusBar hidden={true} />
      <LottieView
        source={require('./assets/animations/animation_spalsh.json')} // Path to your Lottie file
        autoPlay
        loop={false}
        resizeMode="cover" // This will make the Lottie animation resize to cover the entire screen
        onAnimationFinish={() => {
          // If you want to wait until the animation finishes, use this instead of a timer
          navigation.navigate('Login');
        }}
        style={styles.fullscreen} // The style is set to fullscreen
      />
    </View>
  );
}

const styles = StyleSheet.create({
    animationContainer: {
      flex: 1, // This makes the view expand to fill the entire screen
      backgroundColor: '#272727', // or any background color you want for the screen
    },
    fullscreen: {
      position: 'absolute', // This positions the LottieView absolutely to cover the whole screen
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }); 
