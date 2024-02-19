import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from '../../../components/Input'
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Loader from '../../../components/loader';
import AlertMessage from '../../../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setUser } from '../../../store/slices/auth-slice';

const height = Dimensions.get('window').height;

const Login = ({ navigation }) => {
    // const {user, isAuth} = useSelector(state=> state.auth)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({
        username: '',
        password: ''
    });
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    const changeHandler = (name, value) => {
        setInputData({
            ...inputData,
            [name]: value
        })
    }

    const [errors, setErrors] = useState({
        username: false,
        password: false,
    });

    const validateFields = () => {
        const newErrors = {
            username: inputData.username === '',
            password: inputData.password === '',
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(error => error);
        return !hasError;
    };

    const signInHandler = async () => {
        if (validateFields()) {
            setLoading(true);
            try {
                console.log(inputData.username, inputData.password, 'rider')
                const response = await axios.post(`https://tatjana.stgdev.net/api/login`, { username: inputData.username, password: inputData.password, type: 'rider' });
                await AsyncStorage.setItem('token', response.data.data.api_token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
                dispatch(setAuth(true));
                dispatch(setUser(response.data.data));
            } catch (error) {
                console.log(error.message);
                setIsError(true);
                setErrorMessage(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
    }


    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

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
                    <Text style={styles.welcomeText}>Welcome!</Text>
                    <Text style={styles.subheadingText}>Enter Your Sign In Details Below</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <Input error={errors.username} placeholder={'Email / Username'} name="username" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Input error={errors.password} placeholder={'Password'} name="password" secureTextEntry={true} eye={true} onChangeText={changeHandler} />
                    </View>
                    <View style={styles.forgotPasswordContainer}>
                        <Pressable>
                            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
                        </Pressable>
                    </View>
                    <Pressable style={styles.signInBtn} onPress={signInHandler}>
                        <LinearGradient colors={['#9F5F91', '#582C57']} style={styles.signInBtn}>
                            <Text style={styles.btnText}>SIGN IN</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </ScrollView>
            {!isKeyboardVisible && <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Create an account?</Text>
                <Pressable style={styles.signUpBtn} onPress={() => navigation.replace('register')}>
                    <Text style={styles.signUpBtnText}>SIGN UP</Text>
                </Pressable>
            </View>}
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        paddingTop: 34,
        width: '100%'
    },
    innerContainer: {
        width: "100%",
        flexGrow: 1,
        // height: height - 0.1 * height,
    },
    header: {
        width: "100%",
        alignItems: "center"
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
        marginTop: 30
    },
    btnText: {
        color: "#fff",
        fontSize: 17,
        fontFamily: "SFPro-700",
        textAlign: "center"
    },
    signUpContainer: {
        width: "100%",
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
    }
})