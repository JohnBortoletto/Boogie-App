import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from '../../../components/Input'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AlertMessage from '../../../components/Alert';

const CreateAccount = ({ navigation }) => {
    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
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

    const validateFields = () => {
        const newErrors = {
            name: inputData.name === '',
            email: inputData.email === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputData.email),
            password: inputData.password === '',
            confirmPassword: inputData.confirmPassword === '' || inputData.confirmPassword !== inputData.password,
        };
    
        setErrors(newErrors);
    
        const hasError = Object.values(newErrors).some(error => error);
        return !hasError;
    };

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
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.replace('login')}>
                        <Ionicons name={'arrow-back-outline'} size={25} color={'#000'} />
                    </Pressable>
                    <Text style={styles.welcomeText}>Create Account</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <Input error={errors.name} placeholder={'Name *'} name="name" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Input error={errors.email} placeholder={'Email *'} name="email" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Input error={errors.password} placeholder={'Password *'} name="password" secureTextEntry={true} eye={true} onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Input error={errors.confirmPassword} placeholder={'Confirm Password *'} name="confirmPassword" secureTextEntry={true} eye={true} onChangeText={changeHandler} />
                    </View>

                    <Pressable style={styles.signInBtn} onPress={() => 
                        {
                            if (validateFields()) {
                                navigation.navigate('enter-phone', {data: inputData});
                            }                        
                            }}>
                        <LinearGradient colors={['#9F5F91', '#582C57']} style={styles.signInBtn}>
                            <Text style={styles.btnText}>NEXT</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </ScrollView>
            {!isKeyboardVisible && <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Already have an account?</Text>
                <Pressable style={styles.signUpBtn} onPress={() => navigation.replace('login')}>
                    <Text style={styles.signUpBtnText}>Sign In</Text>
                </Pressable>
            </View>}
        </KeyboardAvoidingView>
    )
}

export default CreateAccount

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