import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomCheckbox = ({ isChecked, onChange }) => (
  <TouchableOpacity
    style={[styles.checkbox, isChecked && styles.checked]}
    onPress={onChange}
  >
    {isChecked && <Text style={styles.checkmark}>✓</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#000',
  },
  checkmark: {
    color: '#fff',
  },
});

const CheckBox = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View>
      <CustomCheckbox
        isChecked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      {/* <Text>{isChecked ? "Checked" : "Unchecked"}</Text> */}
    </View>
  );
};

export default CheckBox;