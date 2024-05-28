// components/Logo.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../../assets/SplashScreen-bg.png';

const Logo = () => {
  const navigation = useNavigation();

  const handleLogoClick = () => {
    // Navigate to the login or signup page
    navigation.navigate('LoginOrSignUp');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={handleLogoClick}>
          <Text style={styles.logo}>Shrinkhala</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>A unit of : Ninety Seven Medicare Private Limited</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Make the image cover the entire view
    resizeMode: 'cover', // Stretch the image to fill the view (adjust as needed)
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(56, 178, 172, 0)', // Add transparency to see the background
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Logo;
