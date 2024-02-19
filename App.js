import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation/Navigation';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { Provider } from 'react-redux';
import store from './store/store';
import 'react-native-gesture-handler';


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  useEffect(() => {
    if (status !== 'granted') {
      requestPermission();
    }
  }
    , []);

  let [fontsLoaded, fontError] = useFonts({
    'SFPro-700': require('./assets/fonts/SF-Pro-Display-Bold.ttf'),
    'SFPro-600': require('./assets/fonts/SF-Pro-Display-Medium.ttf'),
    'SFPro-400': require('./assets/fonts/SF-Pro-Display-Regular.ttf')
  })
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: Constants.statusBarHeight,
  },
});
