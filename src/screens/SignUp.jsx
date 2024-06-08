import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({ phoneNumber, setPhoneNumber }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [numberErrorMsg, setNumberErrorMsg] = useState('');
  const [numberError, setNumberError] = useState(false);
  const navigation = useNavigation();

  const numberValidator = (value) => {
    setInputValue(value);
    setIsValid(!isNaN(value));
  };

  const backButtonHandler = () => {
    navigation.navigate('LoginPage');
  };

  const numberSubmit = async () => {
    console.log('inputValue-', inputValue);

    if (inputValue.length === 10) {
      setNumberError(false);
      setPhoneNumber(inputValue);
      await AsyncStorage.setItem('phoneNumber', inputValue);
      navigation.navigate('OtpScreen', { phoneNumber: inputValue });
    } else {
      setNumberError(true);
      setNumberErrorMsg('Please enter a 10 digit phone number.');
    }
  };

  useEffect(() => {
    // setNumberErrorMsg(""); // You can remove this line if not needed
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shrinkhala</Text>
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Please register yourself</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.spacer} />

        <View style={styles.inputLabel}>
          <Text style={styles.labelText}>Enter mobile number:</Text>
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/back.svg')}
            style={styles.backIcon}
            onPress={backButtonHandler}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
            value={inputValue}
            placeholder="Mobile Number"
            onChangeText={numberValidator}
          />
        </View>
        {!isValid && <Text style={styles.errorText}>Please enter a valid number</Text>}
        {numberError && <Text style={styles.errorText}>{numberErrorMsg}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={numberSubmit}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    // marginTop: 8,
    // marginHorizontal: 20,
    // paddingTop: 60,
  },
  header: {
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0198A5',
  },
  subHeader: {
    marginTop: 20,
    paddingTop: 40,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  spacer: {
    height: 20,
  },
  inputLabel: {
    marginTop: 10,
    paddingBottom: 20,
    paddingLeft: 10,
    alignItems: 'center', // Center the label
  },
  labelText: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: 15,
    marginRight: 24,
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 7,
    marginLeft: 35,
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 24,
  },
  continueButton: {
    backgroundColor: '#0198A5',
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUp;
