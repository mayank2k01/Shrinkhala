// SignUp.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Use useNavigation hook instead of navigate directly
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({ phoneNumber, setPhoneNumber }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [numberErrorMsg, setNumberErrorMsg] = useState('');
  const [numberError, setNumberError] = useState(false);
  const navigation = useNavigation(); // Use navigation hook

  const numberValidator = (value) => {
    setInputValue(value);
    setIsValid(!isNaN(value));
  };

  const backButtonHandler = () => {
    navigation.navigate('LoginPage'); // Correct navigation method
  };

  const numberSubmit =async () => {
    console.log('inputValue-', inputValue);

    if (inputValue.length === 10) {
      setNumberError(false);
      setPhoneNumber(inputValue);
      await AsyncStorage.setItem('phoneNumber', inputValue);
    //   localStorage.setItem('phoneNumber', inputValue); // Consider using AsyncStorage instead of localStorage in React Native Expo
      navigation.navigate('OtpScreen', { phoneNumber: inputValue }); // Correct navigation method
    } else {
      setNumberError(true);
      setNumberErrorMsg('Please enter a 10 digit phone number.');
    }
  };

  useEffect(() => {
    // setNumberErrorMsg(""); // You can remove this line if not needed
  }, []);

  return (
    <View style={{ backgroundColor: 'white', flex: 1, marginTop: 8, marginHorizontal: 20 }}>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'teal' }}>Shrinkhala</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Please register yourself</Text>
      </View>

      <View>
        <View style={{ height: 20 }} />

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 18 }}>Enter mobile number:</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Assuming back.svg is an image in your project's assets folder */}
          <Image source={require('../../assets/back.svg')} style={{ width: 20, height: 20, marginRight: 10 }} onPress={backButtonHandler} />
          <TextInput
            style={{ backgroundColor: '#f5f5f5', borderRadius: 50, padding: 10, flex: 1 }}
            keyboardType="numeric"
            maxLength={10}
            value={inputValue}
            placeholder="Mobile Number"
            onChangeText={numberValidator}
          />
        </View>
        {!isValid && <Text style={{ color: 'red', marginTop: 3 }}>Please enter a valid number</Text>}
        {numberError && <Text style={{ color: 'red', marginTop: 3 }}>{numberErrorMsg}</Text>}

        <View style={{ marginTop: 10 }}>
          <Button title="Continue" onPress={numberSubmit} color="teal" />
        </View>
      </View>
    </View>
  );
};

export default SignUp;
