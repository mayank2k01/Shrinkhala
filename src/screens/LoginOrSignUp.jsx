// screens/LoginOrSignUp.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/7317079.jpg'; // Make sure your logo image is in the correct path

const LoginOrSignUp = () => {
  const navigation = useNavigation();

  const handleLogoClick = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogoClick}>
        <Image source={Logo} style={styles.logo} />
      </TouchableOpacity>
      <View style={styles.nav}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginPage')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>A unit of : Ninety Seven Medicare Private Limited</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '100vw', 
    height: '70vh',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  nav: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#38b2ac',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#f0f0f0',
    height: 20,
  },
  footerText: {
    color: '#333',
    fontSize: 12,
  },
});

export default LoginOrSignUp;