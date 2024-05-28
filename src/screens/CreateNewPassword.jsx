import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation
import back from '../../assets/back.svg'; // Assuming you have this image in your project
import createNewPassword from '../../assets/createNewPassword.png'; // Assuming you have this image in your project

const CreateNewPassword = () => {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const backButtonHandler = () => {
        navigation.navigate('ForgetOtpScreen');
    }

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleReEnteredPasswordChange = (text) => {
        setConfirmPassword(text);
    };
    
    const handleSubmit = () => {
        if (password === confirmPassword) {
            // Passwords match, you can proceed with your logic here
            console.log('Passwords match:', password);
            Alert.alert("Password Changed");
            navigation.navigate('LoginPage');
        } else {
            // Passwords do not match, show error or handle accordingly
            setPasswordsMatch(false);
            console.log('Passwords do not match');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={backButtonHandler}>
                <Image source={back} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Create New Password</Text>
            <Image source={createNewPassword} style={styles.image} />
            <Text style={styles.instruction}>
                Your new password must be different from the previously used password.
            </Text>
            <Text style={styles.label}>Enter New Password</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                maxLength={10}
                value={password}
                placeholder='Enter Password'
                onChangeText={handlePasswordChange}
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                maxLength={10}
                value={confirmPassword}
                placeholder='Re-enter Password'
                onChangeText={handleReEnteredPasswordChange}
            />
            {!passwordsMatch && <Text style={styles.errorMsg}>Passwords do not match</Text>}
            <Button title="Save Password" onPress={handleSubmit} color="#008080" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backIcon: {
        width: 20,
        height: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginVertical: 20,
    },
    instruction: {
        fontSize: 16,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    errorMsg: {
        color: 'red',
        marginBottom: 20,
    },
});

export default CreateNewPassword;