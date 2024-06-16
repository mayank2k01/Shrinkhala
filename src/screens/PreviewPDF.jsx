// PreviewPDF.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
// import { Linking, Button } from 'react-native';
// import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';

const PreviewPDF = () => {
  const route = useRoute();
  const { uri } = route.params;
  const source = { uri, cache: true };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        style={styles.webView}
        originWhitelist={['*']}
        useWebKit
        startInLoadingState
      />
      {/* <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={styles.pdf}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webView: { flex: 1 }
});

export default PreviewPDF;
