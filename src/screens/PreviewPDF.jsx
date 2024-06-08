// // PreviewPDF.js
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import PDFReader from 'rn-pdf-reader-js'; // Use the PDF Reader of your choice
// import { useRoute } from '@react-navigation/native';

// const PreviewPDF = () => {
//   const route = useRoute();
//   const { uri } = route.params;

//   return (
//     <View style={styles.container}>
//       <PDFReader
//         source={{ uri }}
//         withPinchZoom
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

// export default PreviewPDF;
