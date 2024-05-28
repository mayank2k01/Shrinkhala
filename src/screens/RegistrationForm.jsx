import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Platform, Alert, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationForm = ({ phoneNumber, patientDetails, setPatientDetails }) => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: phoneNumber,
    patientOrCaregiver: '',
    dob: '',
    age: '',
    gender: '',
    maritalStatus: '',
    alternateNumber: '',
    house: '',
    locality: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    careFirstName: '',
    careLastName: '',
    careMobNo: '',
  });

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleChange = (name, value) => {
    const newFormData = name === 'dob' ? { ...formData, [name]: value, age: calculateAge(value) } : { ...formData, [name]: value };
    setFormData(newFormData);
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const dobMonth = dobDate.getMonth();
    const todayMonth = today.getMonth();

    if (todayMonth < dobMonth || (todayMonth === dobMonth && today.getDate() < dobDate.getDate())) {
      age--;
    }

    return age;
  };

  const registerFormSubmit =async () => {
    setPatientDetails(formData);
    await AsyncStorage.setItem('patientData', JSON.stringify(formData));
    await AsyncStorage.setItem('phoneNumber', formData.mobileNumber);
    navigation.navigate('MoreDetails', { formData });
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    handleChange('dob', currentDate.toISOString().split('T')[0]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Shrinkhala</Text>
      <Text style={styles.title}>Welcome to Shrinkhala!</Text>
      <Text>Please fill up the mandatory details to continue</Text>
      <Text style={styles.sectionTitle}>Patient's Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        maxLength={10}
        value={formData.mobileNumber}
        onChangeText={(value) => handleChange('mobileNumber', value)}
      />
      <Text>Whom does this number belongs to:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity onPress={() => handleChange('patientOrCaregiver', 'patient')} style={styles.radio}>
          <Text>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChange('patientOrCaregiver', 'Care Giver')} style={styles.radio}>
          <Text>Care Giver</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(value) => handleChange('firstName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(value) => handleChange('lastName', value)}
      />
      <TouchableOpacity onPress={showDatepicker} style={styles.datePicker}>
        <Text>{formData.dob || 'Date of Birth'}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={formData.age.toString()}
        onChangeText={(value) => handleChange('age', value)}
        keyboardType="numeric"
      />
      <Text>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(value) => handleChange('gender', value)}
      />
      <Text>Marital Status</Text>
      <TextInput
        style={styles.input}
        placeholder="Marital Status"
        value={formData.maritalStatus}
        onChangeText={(value) => handleChange('maritalStatus', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Alternate Mobile Number"
        keyboardType="numeric"
        maxLength={10}
        value={formData.alternateNumber}
        onChangeText={(value) => handleChange('alternateNumber', value)}
      />
      <Text>Patient's Address</Text>
      <TextInput
        style={styles.input}
        placeholder="House No, Road or Street"
        value={formData.house}
        onChangeText={(value) => handleChange('house', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Locality"
        value={formData.locality}
        onChangeText={(value) => handleChange('locality', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        keyboardType="numeric"
        maxLength={6}
        value={formData.pincode}
        onChangeText={(value) => handleChange('pincode', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={formData.state}
        onChangeText={(value) => handleChange('state', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={formData.city}
        onChangeText={(value) => handleChange('city', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="District"
        value={formData.district}
        onChangeText={(value) => handleChange('district', value)}
      />
      <Text>Care Giver's Details</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.careFirstName}
        onChangeText={(value) => handleChange('careFirstName', value)}
        editable={formData.patientOrCaregiver === 'Care Giver'}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.careLastName}
        onChangeText={(value) => handleChange('careLastName', value)}
        editable={formData.patientOrCaregiver === 'Care Giver'}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        maxLength={10}
        value={formData.careMobNo}
        onChangeText={(value) => handleChange('careMobNo', value)}
        editable={formData.patientOrCaregiver === 'Care Giver'}
      />
      <Button title="Submit" onPress={registerFormSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#008080',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  radio: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistrationForm;
