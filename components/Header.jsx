import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import Category from '../logos/category.svg'; 
import Notification from '../logos/notification-bing.svg'; 
import Location from '../logos/location.svg'; 
import { useNavigation } from '@react-navigation/native';

const Header = ({city}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.openDrawer()}>
        <View style={styles.svgContainer}>
          <Category width={30} height={30} />
        </View>
      </Pressable>
      <View style={styles.locationContainer}>
        <View style={styles.locationIcon}>
          <Location width={20} height={20} />
        </View>
          <Text style={styles.location}>{city}</Text>
      </View>
      <Pressable>
        <View style={styles.svgContainer}>
          <Notification width={30} height={30} />
        </View>
      </Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: "2%",
    left: "5%",
    right: "5%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 999
  },
  svgContainer: {
    padding: 10, 
    backgroundColor: "#FFFFFF", 
    borderRadius: 50, 
  },
  locationIcon: {
    padding: 5, 
    backgroundColor: "#A956A9", 
    borderRadius: 50, 
  },
  locationContainer:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  location:{
    fontFamily: "SFPro-600",
    fontSize: 17,
    color: "#000000",
    marginLeft: 10
  }
});
