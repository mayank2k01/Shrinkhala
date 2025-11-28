import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';

const PreviewPDF = () => {
    const route = useRoute();
    const { uri } = route.params;
    const [fileUri, setFileUri] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('URI in PreviewPDF:', uri);
        if (!uri) {
            setError('Invalid file URI');
            return;
        }

        const getContentUri = async () => {
            try {
                const contentUri = await FileSystem.getContentUriAsync(uri);
                setFileUri(contentUri);
            } catch (error) {
                console.error('Error getting content URI:', error);
                setError(error.message);
            }
        };

        getContentUri();
    }, [uri]);

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!fileUri) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: fileUri }}
                style={styles.webView}
                originWhitelist={['*']}
                useWebKit
                startInLoadingState
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    webView: { flex: 1, width: '100%' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red' },
});

export default PreviewPDF;
