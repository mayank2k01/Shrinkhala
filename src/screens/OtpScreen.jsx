// OtpScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import back from '../../assets/back.svg'; // Adjust the path to your image

const OtpScreen = ({ phoneNumber }) => {
  const navigation = useNavigation();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incorrectOtp, setIncorrectOtp] = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    setIncorrectOtp("");
  }, []);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputs.current[index - 1].focus();
    }
  };

  const backButtonHandler = () => {
    navigation.navigate('SignUp');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const otpString = otp.join('');

    if (otpString === "7044") {
      setIsSubmitting(false);
      navigation.navigate('RegistrationForm', { phoneNumber });
    } else {
      setIsSubmitting(false);
      setIncorrectOtp("Incorrect OTP");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={backButtonHandler}>
        <Image source={back} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.header}>Shrinkhala</Text>
      <Text style={styles.title}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(index, text)}
            onKeyPress={(e) => handleKeyDown(index, e)}
            ref={(input) => (inputs.current[index] = input)}
            keyboardType="numeric"
          />
        ))}
      </View>

      {incorrectOtp ? <Text style={styles.errorMsg}>{incorrectOtp}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Continuing...' : 'Continue'}</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>Resend OTP in 30 seconds</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    alignSelf: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0198A5',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: 55,
    height: 55,
    marginRight: 15,
    textAlign: 'center',
    fontSize: 23,
    borderWidth: 1,
    borderColor: '#ecdede',
  },
  errorMsg: {
    color: 'red',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0198A5',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resendText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#0198A5',
  },
});

export default OtpScreen;
