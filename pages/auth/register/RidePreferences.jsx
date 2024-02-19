import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Input from '../../../components/Input'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown'
import axios from 'axios';
import Loader from '../../../components/loader';
import AlertMessage from '../../../components/Alert';

const RidePreferences = ({ navigation, route }) => {
  const { data, image } = route.params;
  console.log(data, image);
  const [musicArray, setMusicArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    music: ''
  });

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorOkHandler = () => setIsError(false);

  const changeHandler = (value) => {
    setInputData({
      ...inputData,
      music: value
    })
  }

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://tatjana.stgdev.net/api/musics`);
        setMusicArray(response.data.data.map((music) => {
          return {
            label: music.name,
            value: music.id
          }
        }));
      } catch (error) {
        setIsError(true);
        setErrorMessage(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMusic();
  }, [])
  console.log(inputData.music.label, " ", inputData.music.value);

  const doneHandler = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userIdentity_id', {
        uri: image,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('contact_number', data.phone);
      formData.append('driver_preference', 1);
      formData.append('music_choice', inputData.music.value);
      formData.append('fun_fact', data.fun_fact);
      formData.append('next_place', data.next_place);
      formData.append('movie', data.movie);
      formData.append('fear', data.fear);
      formData.append('live_without', data.live_without);
      formData.append('obsessed_with', data.obsessed_with);
      formData.append('next_time', data.next_time);

      const response = await axios.post(`https://tatjana.stgdev.net/api/register`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      console.log(response.data);
      navigation.navigate('login');
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "null"}
      enabled
    >
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        {loading && <Loader />}
        {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name={'arrow-back-outline'} size={25} color={'#000'} />
          </Pressable>
          <Text style={styles.welcomeText}>Ride Preferences</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <Text style={styles.label}>Driver's Preference</Text>
            <Input placeholder={'Coming Soon...'} name="name" onChangeText={changeHandler} editable={false} />
          </View>
          <View style={styles.input}>
            <Text style={styles.label}>Music</Text>
            <Dropdown
              data={musicArray}
              placeholder='Select'
              labelField={'label'}
              valueField='value'
              onChange={changeHandler}
              style={{ width: '100%', borderBottomColor: '#DBDBDB', borderBottomWidth: 1, paddingBottom: 5 }}
            />
          </View>

          <Pressable
            style={[styles.signInBtn, !inputData.music ? styles.disabledBtn : '']}
            onPress={doneHandler}
            disabled={!inputData.music}
          >
            <LinearGradient
              colors={['#9F5F91', '#582C57']}
              style={styles.signInBtn}
            >
              <Text style={styles.btnText}>Done</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RidePreferences

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingTop: 14,
    width: '100%'
  },
  innerContainer: {
    width: "100%",
    flexGrow: 1,
    // height: height - 0.1 * height,
  },
  header: {
    marginLeft: "10%",
    alignItems: "flex-start"
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "SFPro-700",
    marginBottom: 8
  },
  subheadingText: {
    fontSize: 15,
    fontFamily: "SFPro-400"
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "75%",
    marginTop: 40
  },
  forgotPasswordContainer: {
    alignItems: "baseline",
    width: "75%",
    marginTop: 26
  },
  forgotPasswordText: {
    color: "#EF2E24",
    fontSize: 18,
    fontFamily: "SFPro-400",
    textDecorationLine: 'underline'
  },
  signInBtn: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 20
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "SFPro-700",
    textAlign: "center"
  },
  signUpContainer: {
    width: "100%",
    zIndex: 99,
    alignItems: "center",
    marginTop: 30,
    position: "absolute",
    bottom: 0,
    paddingVertical: 50,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    backgroundColor: Platform.OS === "ios" ? "#fff" : "",
    elevation: 3, // This is primarily for Android
    shadowColor: '#000', // iOS
    shadowOffset: {
      width: 0, // Horizontal shadow offset - iOS
      height: 2, // Vertical shadow offset - iOS
    },
    shadowOpacity: 0.5, // Shadow opacity - iOS
    shadowRadius: 3.84, // Shadow blur radius - iOS
  },
  signUpText: {
    fontSize: 16,
    fontFamily: "SFPro-700"
  },
  signUpBtn: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#572C57",
    borderRadius: 25,
  },
  signUpBtnText: {
    color: "#572C57",
    fontSize: 17,
    fontFamily: "SFPro-700",
    textAlign: "center"
  },
  label: {
    color: "#666",
    fontFamily: "SFPro-400",
  },
  disabledBtn: {
    opacity: 0.5, // Or any other visual indication of being disabled
  },
})