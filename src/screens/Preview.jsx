import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
// import Sound from 'react-native-sound';
// import LottieView from 'lottie-react-native';
// import MediaPlayer from 'react-native-media-player';
// import tone from '../../assets/tone1.mp3'

const screenWidth = Dimensions.get('window').width; // Get screen width for dynamic sizing

const Preview = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedFiles, userName } = route.params;

  const [isUploading, setIsUploading] = useState(false); // State to manage loader
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State to manage confirmation modal

  const handleUpload = async () => {
    setShowConfirmationModal(false); // Close the confirmation modal
    setIsUploading(true); // Show the loader
    const formData = new FormData();
    formData.append('user_name', userName);

    try {
      for (const [index, file] of selectedFiles.entries()) {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const fileName = file.uri.split('/').pop() || `file${index}`;
        const fileBlob = new Blob([blob], { type: file.type || 'image/jpeg' });

        formData.append('file', fileBlob, fileName);
      }

      const response = await fetch("http://34.16.227.186:5000/extract", {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        playSuccessTone(); // Play success tone
        Alert.alert('Success', 'Files uploaded successfully');
        navigation.navigate('Dashboard'); // Navigate back to dashboard after upload
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      Alert.alert('Upload Error', 'There was an issue uploading the files.');
    } finally {
      setIsUploading(false); // Hide the loader
    }
  };

  const playSuccessTone = () => {
    // Initialize the sound object with the path to your sound file
    // const successSound = new Sound(require('../../assets/tone.mpeg'), (error) => {
    //   if (error) {
    //     console.log('Failed to load the sound', error);
    //     return;
    //   }
    //   // Play the sound when it's loaded
    //   successSound.play((success) => {
    //     if (!success) {
    //       console.log('Failed to play the sound');
    //     }
    //   });
    // });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.fileContainer}>
        {item.type === 'application/pdf' ? (
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => navigation.navigate('PreviewPDF', { uri: item.uri })}
          >
            <MaterialIcons name="picture-as-pdf" size={100} color="red" />
            <Text>PDF File</Text>
          </TouchableOpacity>
        ) : (
          <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview Selected Files</Text>
      <FlatList
        data={selectedFiles}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent} // Align items in a column
      />
      <TouchableOpacity style={styles.uploadButton} onPress={() => setShowConfirmationModal(true)}>
        <Text style={styles.uploadButtonText}>Upload Files</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      {/* <Modal visible={showConfirmationModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Upload</Text>
            <Text>Are you sure you want to upload these files?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleUpload}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowConfirmationModal(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* Loader Modal */}
      {/* <Modal visible={isUploading} transparent={true} animationType="fade">
        <View style={styles.loaderContainer}>
          <LottieView
            source={require('../../assets/loader.json')} // Ensure you have a loader.json animation in your assets folder
            autoPlay
            loop
          />
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  flatListContent: {
    flexDirection: 'column',
    alignItems: 'center', // Center items horizontally
  },
  fileContainer: {
    alignItems: 'center',
    marginBottom: 20, // Increase space between items
    flexDirection: 'column', // Ensure items are arranged in a column
    backgroundColor: '#f9f9f9', // Add background color for better visibility
    padding: 10, // Add padding around each item
    borderRadius: 10, // Add border radius for rounded corners
    borderWidth: 1, // Add border
    borderColor: '#ddd', // Border color
    width: screenWidth * 0.8, // Use 80% of the screen width for the container
  },
  image: {
    width: '100%', // Make the image take full width of the container
    aspectRatio: 1, // Maintain the aspect ratio (square for initial setup)
    borderRadius: 10, // Optional: Add border radius to images
  },
  removeButton: { marginTop: 10 }, // Adjust position
  previewButton: { alignItems: 'center', justifyContent: 'center' },
  uploadButton: {
    backgroundColor: '#0198A5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  uploadButtonText: { color: 'white', fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#0198A5',
    padding: 10,
    borderRadius: 5,
    minWidth: '40%',
    alignItems: 'center',
  },
  modalButtonText: { color: 'white', fontSize: 16 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default Preview;
