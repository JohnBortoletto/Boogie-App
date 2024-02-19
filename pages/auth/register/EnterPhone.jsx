import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../../../components/loader';
import axios from 'axios';
import AlertMessage from '../../../components/Alert';


const EnterPhone = ({ navigation, route }) => {
    const { data } = route.params;
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({
        phone: ''
    });
    const [errors, setErrors] = useState({
        phone: false,
    });

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    const changeHandler = (value) => {
        setInputData({
            ...inputData,
            phone: value
        })
    }

    const validateFields = () => {
        const newErrors = {
            phone: inputData.phone === '' || inputData.phone.length < 10,
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(error => error);
        return !hasError;
    };

    const continueHandler = async () => {
        if (validateFields()) {
            setLoading(true);
            try {
                const completePhone = "+1" + inputData.phone;
                await axios.post(`https://tatjana.stgdev.net/api/otp`, { phone: completePhone });
                navigation.navigate('verify-phone', { data: data, phone: completePhone });
            } catch (error) {
                setIsError(true);
                setErrorMessage(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
    }

    const errorOkHandler = () => setIsError(false);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "null"}
            enabled
        >
            {loading && <Loader />}
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-outline'} size={25} color={'#000'} />
                </Pressable>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    contentContainerStyle={styles.innerContainer}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.imgContainer}>
                        <Image source={require('../../../assets/OTPScreenVector.png')} />
                    </View>
                    <View style={styles.headingContainer}>
                        <Text style={styles.headingText}>Phone Number</Text>
                        <Text style={styles.headingSubText}>Boogie Rides will send you a text with a verification code.  </Text>
                    </View>
                    <View style={styles.cellsContainerParent}>
                        <View style={styles.cellsContainer}>
                            <TextInput editable={false} placeholder='+1' placeholderTextColor={"#000"} style={styles.countryCode} />
                            <TextInput keyboardType='numeric' placeholder='Enter phone' placeholderTextColor={"#00000067"} style={errors.phone ? styles.phoneInputError : styles.phoneInput} onChangeText={changeHandler} maxLength={10} />
                        </View>
                    </View>

                    {!isKeyboardVisible && <View style={styles.nextBtnContainer}>
                        <Pressable style={styles.signInBtn} onPress={continueHandler}>
                            <LinearGradient colors={['#9F5F91', '#582C57']} style={styles.signInBtn}>
                                <Text style={styles.btnText}>CONTINUE</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default EnterPhone

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: '11.6%',
        height: 35,
        fontSize: 24,
        textAlignVertical: 'center',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#9F5F91',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    focusCell: {
        borderColor: '#582C57',
    },
    cellsContainerParent: {
        width: "100%",
        alignItems: "center",
        marginTop: 20
    },
    cellsContainer: {
        marginTop: 20,
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
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
        // alignItems: "flex-start"
    },
    imgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    headingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    headingText: {
        fontSize: 24,
        fontFamily: "SFPro-700",
        opacity: 0.7
    },
    headingSubText: {
        fontSize: 16,
        fontFamily: "SFPro-400",
        marginTop: 10,
        color: "#717171"
    },
    phone: {
        fontSize: 16,
        fontFamily: "SFPro-600",
        marginTop: 10
    },
    nextBtnContainer: {
        alignItems: "center",
        position: "absolute",
        bottom: 20,
        width: "100%",
        zIndex: -1,
    },
    signInBtn: {
        width: "80%",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontSize: 17,
        fontFamily: "SFPro-700",
        textAlign: "center"
    },
    timer: {
        fontSize: 16,
        fontFamily: "SFPro-600",
        color: "#CC2F00"
    },
    bottomText: {
        color: "#2F2E41",
        fontSize: 14,
        fontFamily: "SFPro-400",
    },
    resendText: {
        color: "#000",
        fontSize: 16,
        fontFamily: "SFPro-600",
    },
    countryCode: {
        fontSize: 18,
        fontFamily: "SFPro-600",
        borderWidth: 2,
        borderColor: '#8D528233',
        borderRadius: 40,
        padding: 10,
        width: "25%",
        textAlign: "center",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    phoneInput: {
        fontSize: 18,
        fontFamily: "SFPro-600",
        borderWidth: 2,
        borderColor: '#8D528233',
        borderRadius: 40,
        padding: 10,
        width: "70%",
        textAlign: "left",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    phoneInputError: {
        fontSize: 18,
        fontFamily: "SFPro-600",
        borderWidth: 2,
        borderColor: '#ff0000',
        borderRadius: 40,
        padding: 10,
        width: "70%",
        textAlign: "left",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }

})