import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
      //Changer selon l'adresse de la machine
        source={{ uri: 'http://192.168.1.22:8080' }}
        style={styles.webview}
        // si besoin de passer des headers (authentification)
        // source={{
        //   uri: 'https://votre-domaine.com',
        //   headers: { Authorization: 'Bearer TOKEN_UTILE' }
        // }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // pour éviter la barre Android
  },
  webview: {
    flex: 1,
  },
});

