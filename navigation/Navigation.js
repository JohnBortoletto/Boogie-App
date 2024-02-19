import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Login from '../pages/auth/login';
import CreateAccount from '../pages/auth/register/CreateAccount';
import AboutMe from '../pages/auth/register/AboutMe';
import UploadId from '../pages/auth/register/UploadId';
import RidePreferences from '../pages/auth/register/RidePreferences';
import VerifyOtp from '../pages/auth/register/VerifyOtp';
import EnterPhone from '../pages/auth/register/EnterPhone';
import { useDispatch, useSelector } from 'react-redux';
import { Image, StyleSheet } from 'react-native';
import Home from '../pages/main/home';
import BoogieDrawer from '../components/BoogieDrawer';
import { Ionicons } from '@expo/vector-icons'
import Inbox from '../pages/main/Inbox';
import RideHistory from '../pages/main/Ride-History/index';
import Settings from '../pages/main/Settings';
import Support from '../pages/main/Support/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuth, setUser } from '../store/slices/auth-slice';
import 'react-native-gesture-handler';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const RegisterStack = () => {
  return (
    <Stack.Navigator initialRouteName='create-account' screenOptions={{ animation: 'slide_from_right', headerShown: false }}>
      <Stack.Screen name="create-account" component={CreateAccount} />
      <Stack.Screen name="about-me" component={AboutMe} />
      <Stack.Screen name="upload-id" component={UploadId} />
      <Stack.Screen name="ride-preferences" component={RidePreferences} />
      <Stack.Screen name="enter-phone" component={EnterPhone} />
      <Stack.Screen name="verify-phone" component={VerifyOtp} />
    </Stack.Navigator>
  )
}

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName='home'
      drawerContent={(props) => <BoogieDrawer {...props} />}
      screenOptions={{
        drawerLabelStyle: { fontWeight: "500", fontSize: 17, color: "#000" },
        drawerItemStyle: { marginVertical: 5 },
        drawer: { marginTop: 30 },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        options={{
          drawerIcon: () => <Ionicons name={'home-outline'} size={24} color={'#000'} />,
          drawerItemStyle: { marginTop: "10%" },
        }}
        name="Home"
        component={Home}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Ionicons name={'mail-outline'} size={24} color={'#000'} />,
          // drawerItemStyle: { marginTop: "10%" },
        }}
        name="Inbox"
        component={Inbox}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Ionicons name={'car-outline'} size={24} color={'#000'} />,
          // drawerItemStyle: { marginTop: "10%" },
        }}
        name="Ride History"
        component={RideHistory}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Ionicons name={'settings-outline'} size={24} color={'#000'} />,
          // drawerItemStyle: { marginTop: "10%" },
        }}
        name="Settings"
        component={Settings}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Ionicons name={'help-circle-outline'} size={24} color={'#000'} />,
          // drawerItemStyle: { marginTop: "10%" },
        }}
        name="Support"
        component={Support}
      />
    </Drawer.Navigator>
  )
}


const Navigation = () => {
  const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.auth.isAuth);
    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            let user = await AsyncStorage.getItem('user');
            user = JSON.parse(user);
            if (token && user) {
                dispatch(setAuth(true));
                dispatch(setUser(user));
            }
        }
        checkAuth();
    }, []);
  // const { isAuth } = useSelector(state => state.auth);
  // console.log(isAuth);
  return isAuth ? (
    <Stack.Navigator initialRouteName='draw' screenOptions={{ animation: 'default', headerShown: false }}>
      <Stack.Screen name="draw" component={DrawerNavigation} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator initialRouteName='login' screenOptions={{ animation: 'default', headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={RegisterStack} />
    </Stack.Navigator>
  )


}

export default Navigation;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    aspectRatio: 1,
  }
})