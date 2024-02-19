import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import axios from 'axios';
import Loader from '../../../components/loader';
import AlertMessage from '../../../components/Alert';

const CELL_COUNT = 6;

const VerifyOTP = ({ navigation, route }) => {
    const { phone, data } = route.params;
    const [loading, setLoading] = useState(false);

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

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const [timer, setTimer] = useState(30);

    const startTimer = () => {
        setTimer(30);
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timer]);

    const resendHandler = async () => {
        setLoading(true);
        try {
            await axios.post(`https://tatjana.stgdev.net/api/otp`, { phone: phone });
            startTimer();
            setIsError(true);
            setErrorMessage('OTP sent successfully');
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const nextHandler = async () => {
        setLoading(true);
        try {
            await axios.post(`https://tatjana.stgdev.net/api/verifyotp`, { phone_number: phone, otp: value });
            navigation.navigate('about-me', { data: data, phone: phone });
        } catch (error) {
            setIsError(true);
            setErrorMessage(error.response.data.message);
        } finally {
            setLoading(false);
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
                        <Text style={styles.headingText}>Enter Verification Code</Text>
                        <Text style={styles.headingSubText}>Input the 6 digit code that we have sent to</Text>
                        <Text style={styles.phone}>{phone}</Text>
                    </View>
                    <View style={styles.cellsContainerParent}>
                        <View style={styles.cellsContainer}>
                            <CodeField
                                ref={ref}
                                {...props}
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                        </View>
                    </View>

                    {!isKeyboardVisible && <View style={styles.nextBtnContainer}>
                        <Pressable style={[styles.signInBtn, !(value.length === CELL_COUNT) && styles.disabledBtn]} onPress={nextHandler} disabled={!(value.length === CELL_COUNT)}>
                            <LinearGradient colors={['#9F5F91', '#582C57']} style={[styles.signInGradientBtn, !(value.length === CELL_COUNT) && styles.disabledGradient]}>
                                <Text style={styles.btnText}>NEXT</Text>
                            </LinearGradient>
                        </Pressable>
                        <Text style={styles.timer}>0:{timer}</Text>
                        <Text style={styles.bottomText}>Haven’t received the code yet?</Text>
                        {timer === 0 && <Pressable onPress={resendHandler}>
                            <Text style={styles.resendText}>Resend Code</Text>
                        </Pressable>}
                    </View>}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default VerifyOTP

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: '11.6%',
        height: 35,
        fontSize: 24,
        textAlignVertical: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#cba3c3',
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
        width: "70%",
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
        marginTop: 20
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
    signInGradientBtn: {
        width: "100%",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: 'center', // Make sure the text aligns center
    },
    disabledBtn: {
        // This will apply to the Pressable component
        opacity: 0.7,
    },
    disabledGradient: {
        // If you need to adjust the LinearGradient specifically when disabled
        opacity: 0.7,
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
    }

})