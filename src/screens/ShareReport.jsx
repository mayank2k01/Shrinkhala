import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPPopup from "./OTPPopup"; // Assuming you have an OTPPopup component for OTP handling
import axios from "axios";

const ShareReport = () => {
    const [userName, setUserName] = useState('');
    const navigation = useNavigation();
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otp, setOtp] = useState('');
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [qrData, setQrData] = useState({ doctor_id: "", full_name: "", name_of_hospital: "" });
    const [doctorsList, setDoctorsList] = useState([]);

    useEffect(() => {
        const username = AsyncStorage.getItem('userName');
        if (username) {
            setUserName(username);
        }
    }, []);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleScannerOpen = () => {
        setShowScannerModal(true);
    };

    const closeScannerModal = () => {
        setShowScannerModal(false);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    useEffect(() => {
        fetch(`http://34.131.227.229:8081/patient/${userName}/doctors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map(doctor => ({
                    id: doctor.user_id,
                    name: `${doctor.first_name} ${doctor.last_name}`
                }));
                setDoctorsList(transformedData);
            })
            .catch(error => {
                console.error('Error fetching doctors data:', error);
            });
    }, [userName]);

    const handleRemoveDoctor = (doctorId) => {
        fetch(`http://34.131.227.229:8081/patient/${userName}/doctors/${doctorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                const updatedDoctorsList = doctorsList.filter(doctor => doctor.id !== doctorId);
                setDoctorsList(updatedDoctorsList);
            })
            .catch(error => {
                console.error('Error removing doctor:', error);
            });
    };

    const handleScan = ({ data }) => {
        if (data) {
            const scannedText = JSON.parse(data);

            fetch('http://34.131.227.229:8081/doctor/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doctor_id: scannedText.doctor_id,
                    patient_id: userName
                })
            })
                .then(response => response.json())
                .then(responseData => {
                    setQrData({
                        ...scannedText,
                        doctor_id: scannedText.doctor_id,
                        name_of_hospital: scannedText.name_of_hospital,
                        full_name: scannedText.full_name
                    });
                    setShowScannerModal(false);
                    setShowSuccessModal(true);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleGenerateOTP = () => {
        fetch('http://34.131.227.229:8081/patient/generate_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userName
            })
        })
            .then(response => response.json())
            .then(data => {
                const otp = data.otp;
                setOtp(otp);
                setShowOtpPopup(true);
            })
            .catch(error => {
                console.error('Error generating OTP:', error);
            });
    };

    return (
        <>
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <MaterialIcons name="arrow-back" size={24} color="gray" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Share with Doctor</Text>
            </View> */}
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Share your Reports</Text>
                <Text style={styles.subtitle}>All your Reports will be shared with the doctor</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleGenerateOTP}>
                        <MaterialIcons name="lock" size={24} color="#0198A5" />
                        <Text style={styles.buttonText}>Via OTP</Text>
                    </TouchableOpacity>
                    <Text style={styles.orText}>OR</Text>
                    <TouchableOpacity style={styles.button} onPress={handleScannerOpen}>
                        <MaterialIcons name="qr-code-scanner" size={24} color="#0198A5" />
                        <Text style={styles.buttonText}>Via QR Scanner</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.doctorsList}>
                    <Text style={styles.doctorsListTitle}>Shared with</Text>
                    <Text style={styles.doctorsListSubtitle}>Doctors you have shared all your reports</Text>
                    {doctorsList.map((doctor, index) => (
                        <View key={index} style={styles.doctorItem}>
                            <Text style={styles.doctorName}>{doctor.name}</Text>
                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveDoctor(doctor.id)}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <Modal
                visible={showScannerModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeScannerModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <BarCodeScanner
                            onBarCodeScanned={handleScan}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={closeScannerModal}>
                            <MaterialIcons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeSuccessModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.successModalContent}>
                        <Text style={styles.successTitle}>Shared Successfully!</Text>
                        <Text style={styles.successMessage}>
                            Your account has been Successfully Connected with <Text style={styles.highlight}>{qrData.full_name}</Text> at <Text style={styles.highlight}>{qrData.name_of_hospital}</Text>
                        </Text>
                        <TouchableOpacity style={styles.okButton} onPress={closeSuccessModal}>
                            <Text style={styles.okButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {showOtpPopup && (
                <OTPPopup userName={userName} otp={otp} onClose={() => setShowOtpPopup(false)} />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 32,
        
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#0198A5',
        backgroundColor: '#e6f6f6',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#0198A5',
        fontSize: 16,
        marginLeft: 8,
    },
    orText: {
        fontSize: 16,
        color: 'gray',
        marginVertical: 8,
    },
    doctorsList: {
        marginTop: 32,
        // backgroundColor: 'white'
    },
    doctorsListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    doctorsListSubtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
    doctorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    doctorName: {
        fontSize: 16,
    },
    removeButton: {
        padding: 8,
        backgroundColor: 'lightpink',
        borderRadius: 4,
    },
    removeButtonText: {
        color: '#F1416C',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        height: '50%',
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 8,
    },
    successModalContent: {
        width: '80%',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    highlight: {
        fontWeight: 'bold',
    },
    okButton: {
        backgroundColor: '#0198A5',
        padding: 16,
        borderRadius: 8,
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ShareReport;
