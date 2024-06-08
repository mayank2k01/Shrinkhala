// import React from 'react';
// import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Pdf from 'react-native-pdf';

// const ReportViewer = ({ route }) => {
//   const { url } = route.params; // Assuming url is passed as a route parameter
//   const fileType = url.split('.').pop().toLowerCase(); // Get the file type
//   const navigation = useNavigation();

//   // Render PDF or image based on the file type
//   const renderFile = () => {
//     if (fileType === 'pdf') {
//       return (
//         <Pdf
//           source={{ uri: url }}
//           style={styles.pdf}
//           onLoadComplete={(numberOfPages, filePath) => {
//             console.log(`Number of pages: ${numberOfPages}`);
//           }}
//           onPageChanged={(page, numberOfPages) => {
//             console.log(`Current page: ${page}`);
//           }}
//           onError={(error) => {
//             console.log(error);
//           }}
//         />
//       );
//     } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
//       return <Image source={{ uri: url }} style={styles.image} />;
//     } else {
//       return <Text>Unsupported file type</Text>;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.content}>
//         {renderFile()}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'white',
//   },
//   backButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   backButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//   },
//   image: {
//     width: '100%',
//     height: '80%',
//     resizeMode: 'contain',
//   },
// });

// export default ReportViewer;