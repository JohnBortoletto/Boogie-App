import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import profile from "../assets/profile.png";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "./loader";
import AlertMessage from "./Alert";
import { setAuth, setUser } from "../store/slices/auth-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BoogieDrawer = (props) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.get(`https://tatjana.stgdev.net/api/logout`, { headers: { Authorization: `Bearer ${user.api_token}` } });
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      dispatch(setAuth(false));
      dispatch(setUser({}));
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response.data.messsage);
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorOkHandler = () => setIsError(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Loader loading={loading} />
      {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: "20%" }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <Image
            source={{uri: user.profile_image}}
            style={{ width: 69, height: 69, borderRadius: 100 }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#000", fontWeight: "600", fontSize: 22 }}>
              Smith Jho
            </Text>
            <Text
              style={{
                marginLeft: 8,
                color: "#666666",
                fontWeight: "300",
                fontSize: 12,
              }}
            >
              Passenger
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <AntDesign
                name="edit"
                size={13}
                color="#4388FC"
                onPress={() => console.log("pressed")}
              />
              <Text
                style={{
                  color: "#4388FC",
                  fontWeight: "500",
                  fontSize: 12,
                  marginLeft: 5,
                }}
              >
                Edit Profile
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{ borderWidth: 1, borderColor: "#E6E6E6", marginTop: "10%" }}
        />
        <DrawerItemList {...props} />
        <TouchableOpacity
          style={styles.customItem}
          onPress={handleLogout}
        >
          <Ionicons name="power-outline" size={24} color="#000" />
          <Text style={styles.customItemText}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

export default BoogieDrawer;

const styles = StyleSheet.create({
  customItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 20,
  },
  customItemText: {
    marginLeft: 32,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
