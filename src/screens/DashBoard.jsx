import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Modal, ImageBackground, Alert, Linking, SafeAreaView, ScrollView } from "react-native";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import backgroundImage from '../../assets/transparent-bg.png';
import whiteimg from '../../assets/white.png';
// import FilePickerManager from 'react-native-file-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';

const getPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  return status === 'granted';
};

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null); 

  const [reports, setReports] = useState([]);
  const [activeSpan, setActiveSpan] = useState("All");
  const [activeTab, setActiveTab] = useState('Home');

  const navigation = useNavigation();

  useEffect(() => {
    const getUserInfo = async () => {
      const username = await AsyncStorage.getItem('userName'); // replace this with actual async storage call if needed
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

  const handleDownload = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  // const handleUploadOption = () => {
  //   setShowUploadModal(true);
  // };
  const handleUploadPDFReport = async () => {
    // Handle PDF upload logic
    setShowModal(false);
    getPermission();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: true,
      });
      console.log('res--',result);

      if (true) {
        setFile(result);
        navigation.navigate('PreviewPDF', { uri: result.assets[0].uri });
      } else {
        console.log("Document picking cancelled");
      }
    } catch (err) {
      console.error("Error picking document: ", err);
    }
  };

  const handleUploadImageReport = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      closeModal();
      navigation.navigate('Preview', { selectedFiles: result.assets, userName });
    }
  };

  const handleCaptureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });

    if (!result.canceled) {
      closeModal();
      navigation.navigate('Preview', { selectedFiles: [result], userName });
    }
  };

  const getTestTypeColor = (testType) => {
    switch (testType) {
      case 'Blood':
        return { textColor: '#F1416C', bgColor: '#F1416C1A' };
      case 'Radiology':
        return { textColor: '#01A52F', bgColor: '#01A52F1A' };
      case 'Pathology':
        return { textColor: '#278AE6', bgColor: '#278AE61A' };
      default:
        return { textColor: '#000000', bgColor: '#FFFFFF' }; // Default text and background color
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

  const handleUploadOption = () => {
    setShowModal(false);
    setShowSecondModal(true);
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground source={whiteimg} style={styles.backgroundImage}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.overlay}>
              <Text style={styles.title}>Medi.ai</Text>
              <View style={styles.profileContainer}>
                <View style={styles.circularIcon}>
                  <Text style={styles.initials}>{getInitials(name)}</Text>
                </View>
                <Text style={styles.userInfo}>Patient: {name}</Text>
                <Text style={styles.userInfo}>UID No: {userName}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.button} onPress={openModal}>
                  <MaterialIcons name="cloud-upload" size={28} color="#0198A5" style={styles.icon} />
                  <Text style={styles.buttonText}>Upload Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShareReport')}>
                  <MaterialIcons name="share" size={24} color="#0198A5" style={styles.icon} />
                  <Text style={styles.buttonText}>Share with Doctor</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <ImageBackground source={backgroundImage}>
                <View style={{ paddingTop: 10 }}>
                  <Text style={{ fontSize: 20, }}>Your Reports</Text>
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
                          <View style={styles.reportLeftContainer}>
                            <Text style={styles.reportTitle}>Report Name: {item.test_name}</Text>
                            <Text style={styles.reportSubtitle}>Test Type: {item.test_type}</Text>
                            <TouchableOpacity style={styles.btn} onPress={() => handleDownload(item.unique_file_path_name)}>
                              <Text style={styles.btnText}>Download</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.reportRightContainer}>
                            <Text style={[styles.testType, { backgroundColor: getTestTypeColor(item.test_type).bgColor, color: getTestTypeColor(item.test_type).textColor }]}>{item.test_type}</Text>
                            <Text style={styles.reportDate}>{item.extracted_date}</Text>
                            <TouchableOpacity style={styles.btnView} onPress={() => handleView(item.unique_file_path_name)} >
                              <Text style={styles.btnViewColor}>View</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 70 }} // Ensures the list doesn't get hidden behind the tab
                />
              </ImageBackground>
              <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.modalClose} onPress={() => setShowModal(false)}>
                      <Text style={styles.modalCloseText}>&times;</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Upload a new Report</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleUploadOption}>
                      <Text style={styles.uploadButtonText}>From Phone</Text>
                    </TouchableOpacity>
                    <Text style={styles.orText}>OR</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleCaptureImage}>
                      <Text style={styles.uploadButtonText}>Scan report</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

            </View>

            <Modal visible={showSecondModal} transparent={true} animationType="slide">
              <View style={styles.customModalContainer}>
                <View style={styles.customModalContent}>
                  <Text style={styles.modalTitle}>Select Upload Type</Text>
                  <TouchableOpacity onPress={handleUploadPDFReport} style={styles.uploadOption}>
                    <Text style={styles.uploadOptionText}>Upload PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleUploadImageReport} style={[styles.uploadOption, styles.lastUploadOption]}>
                    <Text style={styles.uploadOptionText}>Upload Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalClose} onPress={() => setShowSecondModal(false)}>
                    <Text style={styles.modalCloseText}>&times;</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </ScrollView>
          <View style={styles.tabContainer}>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => {
                  setActiveTab('Profile');
                  navigation.navigate('Profile');
                }}
            >
              <MaterialIcons name="person" size={30} color={activeTab === 'Profile' ? '#0198A5' : 'grey'} />
              <Text style={[styles.tabText, activeTab === 'Profile' && styles.activeTabText]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab('Home')}
            >
              <MaterialIcons name="home" size={30} color={activeTab === 'Home' ? '#0198A5' : 'grey'} />
              <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>Home</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
      marginTop: 10+15
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    height: 100,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0198A5' },
  profileContainer: { alignItems: 'center', marginVertical: 20 },
  circularIcon: { width: 70, height: 70, borderRadius: 50, backgroundColor: '#e4d8fc', justifyContent: 'center', alignItems: 'center' },
  initials: { color: '#7239EA', fontSize: 32, fontWeight: 'bold' },
  userInfo: { fontSize: 18, marginVertical: 5 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  button: { backgroundColor: '#e6f6f6', padding: 15, borderRadius: 5, alignItems: 'center', paddingVertical: 40 },
  buttonText: { color: '#0198A5', fontSize: 16, marginTop: 5 },
  icon: { marginBottom: 5 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  filterButton: { padding: 10, borderRadius: 18, backgroundColor: '#e0e0e0' },
  activeFilter: { backgroundColor: '#0198A5' },
  filterText: { color: 'white', fontSize: 16 },
  reportInfo: { marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 0,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    color: 'grey',
    marginTop: 5,
  },
  activeTabText: {
    color: '#0198A5',
  },
  btn: {
    backgroundColor: '#e6f6f6',
    borderRadius: 15,
    padding: 6,
    width: 100,
    alignItems: "center"
  },
  btnView: {
    backgroundColor: '#0198A5',
    borderRadius: 15,
    padding: 6,
    width: 60,
    alignItems: "center",
    color: "white"
  },
  btnViewColor: {
    color: 'white'
  },
  btnText: {
    color: '#0198A5',
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  testType: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  reportLeftContainer: {
    flex: 1,
  },
  reportRightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportTitle: {
    fontWeight: 'bold',
  },
  reportSubtitle: {
    fontSize: 13,
    marginTop: 5,
  },
  reportDate: {
    fontSize: 13,
    marginTop: 5,
  },
  divider: {
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalContent: {
    backgroundColor: 'white', // White background for modal content
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalCloseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  modalTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#0198A5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  orText: {
    fontSize: 16,
    marginVertical: 10,
  },
  customModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  customModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  uploadOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  lastUploadOption: {
    borderBottomWidth: 0, // Remove border bottom for the last option
  },
  uploadOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Dashboard;
