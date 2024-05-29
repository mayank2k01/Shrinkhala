import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Modal, ImageBackground, Alert } from "react-native";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../../assets/transparent-bg.png';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [activeSpan, setActiveSpan] = useState("All");

  const navigation = useNavigation();

  useEffect(() => {
    const getUserInfo = async () => {
    //   const username = await AsyncStorage.getItem('userName');
    const username =  'SuKu45675';
      if (username) {
        setUserName(username);
      }

      const fullNameFromLocalStorage = await AsyncStorage.getItem('fullName');
      if (fullNameFromLocalStorage) {
        setName(fullNameFromLocalStorage);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    if (userName) {
      fetchReports();
    }
  }, [userName]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`http://34.16.227.186:5000/reports/${userName}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleUploadReport = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      const { uri } = result;
      const formData = new FormData();
      formData.append('file', { uri, name: 'report.jpg', type: 'image/jpeg' });
      formData.append('user_name', userName);

      try {
        await axios.post("http://34.16.227.186:5000/extract", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Alert.alert('Success', 'Image uploaded successfully');
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleCaptureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });

    if (!result.cancelled) {
      handleUploadReport(result.uri);
    }
  };

  const handleView = (url) => {
    navigation.navigate('ReportViewer', { url });
  };

  const handleSpanClick = (span) => {
    setActiveSpan(span);
  };

  const filteredReports = activeSpan === "All"
    ? reports
    : reports.filter(report => report.test_type === activeSpan || (activeSpan === "Blood test" && report.test_type_1 === "B"));

  const getInitials = (name) => {
    return name.split(" ").map(part => part.charAt(0)).join("").toUpperCase();
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Medi.ai</Text>
        <View style={styles.profileContainer}>
          <View style={styles.circularIcon}>
            <Text style={styles.initials}>{getInitials(name)}</Text>
          </View>
          <Text style={styles.userInfo}>Patient: {name}</Text>
          <Text style={styles.userInfo}>UID No: {userName}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Text style={styles.buttonText}>Upload Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShareReport')}>
            <Text style={styles.buttonText}>Share with Doctor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => handleSpanClick("All")} style={[styles.filterButton, activeSpan === "All" && styles.activeFilter]}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSpanClick("Blood test")} style={[styles.filterButton, activeSpan === "Blood test" && styles.activeFilter]}>
            <Text style={styles.filterText}>Blood test</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSpanClick("Radiology")} style={[styles.filterButton, activeSpan === "Radiology" && styles.activeFilter]}>
            <Text style={styles.filterText}>Radiology</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSpanClick("Pathology")} style={[styles.filterButton, activeSpan === "Pathology" && styles.activeFilter]}>
            <Text style={styles.filterText}>Pathology</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredReports}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.reportItem}>
              <View>
                <Text style={styles.reportTitle}>Report Name: {index + 1}</Text>
                <Text>Test Type: {item.test_name}</Text>
                <Button title="Download" onPress={() => handleDownload(item.unique_file_path_name)} />
              </View>
              <View>
                <Text>Date: {item.extracted_date}</Text>
                <Button title="View" onPress={() => handleView(item.unique_file_path_name)} />
              </View>
            </View>
          )}
        />

        <Modal visible={showModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Text style={styles.modalCloseText}>&times;</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Upload a new Report</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadReport}>
              <Text style={styles.uploadButtonText}>From Phone</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>OR</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleCaptureImage}>
              <Text style={styles.uploadButtonText}>Scan report</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
  },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00796b' },
  profileContainer: { alignItems: 'center', marginVertical: 20 },
  circularIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#00796b', justifyContent: 'center', alignItems: 'center' },
  initials: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  userInfo: { fontSize: 18, marginVertical: 5 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  button: { backgroundColor: '#00796b', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 16 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  filterButton: { padding: 10, borderRadius: 10, backgroundColor: '#e0e0e0' },
  activeFilter: { backgroundColor: '#00796b' },
  filterText: { color: 'white', fontSize: 16 },
  reportItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginVertical: 5, borderWidth: 1, borderColor: '#ddd', borderRadius: 10 },
  reportTitle: { fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalClose: { position: 'absolute', top: 40, right: 20 },
  modalCloseText: { fontSize: 24, color: 'white' },
  modalTitle: { fontSize: 20, marginBottom: 20, color: 'white' },
  uploadButton: { backgroundColor: '#00796b', padding: 15, borderRadius: 10, marginVertical: 10 },
  uploadButtonText: { color: 'white', fontSize: 16 },
  orText: { color: 'white', marginVertical: 20 }
});

export default Dashboard;
