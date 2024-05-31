import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet, ScrollView, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

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

  const registerFormSubmit = async () => {
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
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
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
        <Text>Whom does this number belong to:</Text>
        <View style={styles.radioContainer}>
          <View style={styles.radioOption}>
            <RadioButton
              value="patient"
              status={formData.patientOrCaregiver === 'patient' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('patientOrCaregiver', 'patient')}
              color="#0198A5"
            />
            <Text style={styles.radioText}>Patient</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="caregiver"
              status={formData.patientOrCaregiver === 'Care Giver' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('patientOrCaregiver', 'Care Giver')}
              color="#0198A5"
            />
            <Text style={styles.radioText}>Care Giver</Text>
          </View>
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(value) => handleChange('firstName', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(value) => handleChange('lastName', value)}
          />
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={showDatepicker} style={[styles.datePicker, styles.halfInput, styles.marginRight]}>
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
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Age"
            value={formData.age.toString()}
            onChangeText={(value) => handleChange('age', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.input, styles.halfInput, styles.marginRight]}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => handleChange('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label="Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </View>
          <View style={[styles.input, styles.halfInput, styles.marginLeft]}>
            <Picker
              selectedValue={formData.maritalStatus}
              onValueChange={(value) => handleChange('maritalStatus', value)}
              style={styles.picker}
            >
              <Picker.Item label="Marital Status" value="" />
              <Picker.Item label="Single" value="single" />
              <Picker.Item label="Married" value="married" />
              <Picker.Item label="Divorced" value="divorced" />
              <Picker.Item label="Widowed" value="widowed" />
            </Picker>
          </View>
        </View>
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
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="Locality"
            value={formData.locality}
            onChangeText={(value) => handleChange('locality', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Pincode"
            keyboardType="numeric"
            maxLength={6}
            value={formData.pincode}
            onChangeText={(value) => handleChange('pincode', value)}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="City"
            value={formData.city}
            onChangeText={(value) => handleChange('city', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="District"
            value={formData.district}
            onChangeText={(value) => handleChange('district', value)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="State"
          value={formData.state}
          onChangeText={(value) => handleChange('state', value)}
        />
        <Text>Care Giver's Details</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="First Name"
            value={formData.careFirstName}
            onChangeText={(value) => handleChange('careFirstName', value)}
            editable={formData.patientOrCaregiver === 'Care Giver'}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Last Name"
            value={formData.careLastName}
            onChangeText={(value) => handleChange('careLastName', value)}
            editable={formData.patientOrCaregiver === 'Care Giver'}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={formData.careMobNo}
          onChangeText={(value) => handleChange('careMobNo', value)}
          editable={formData.patientOrCaregiver === 'Care Giver'}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={registerFormSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: width * 0.05,
    paddingBottom: height * 0.1, // Add more padding at the bottom
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#008080',
    marginVertical: width * 0.05,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: width * 0.05,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    padding: width * 0.025,
    marginVertical: width * 0.025,
    flex: 1, // Ensure inputs take up available space to prevent overflow
  },
  halfInput: {
    flex: 1,
  },
  radioContainer: {
    flexDirection: 'row',
    marginVertical: width * 0.025,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.025,
  },
  radioText: {
    marginLeft: width * 0.01,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    padding: width * 0.025,
    marginVertical: width * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: width * 0.025,
  },
  marginRight: {
    marginRight: width * 0.0125,
  },
  marginLeft: {
    marginLeft: width * 0.0125,
  },
  picker: {
    height: width * 0.1,
    marginTop: -5,
  },
  footer: {
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#008080',
    borderRadius: 50,
    paddingVertical: width * 0.025,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default RegistrationForm;
