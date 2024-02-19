import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Input from '../../../components/Input'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AboutMe = ({ navigation, route }) => {
    const { data, phone } = route.params;
    const [aboutMeData, setInputData] = useState({
        fun_fact: '',
        next_place: '',
        movie: '',
        fear_detail: '',
        live_without: '',
        obsessed_with: '',
        next_time: ''
    });
    const [errors, setErrors] = useState({
        fun_fact: false,
        next_place: false,
        movie: false,
        fear_detail: false,
        live_without: false,
        obsessed_with: false,
        next_time: false,
    });

    const validateFields = () => {
        const newErrors = {
            fun_fact: aboutMeData.fun_fact === '',
            next_place: aboutMeData.next_place === '',
            movie: aboutMeData.movie === '',
            fear_detail: aboutMeData.fear_detail === '',
            live_without: aboutMeData.live_without === '',
            obsessed_with: aboutMeData.obsessed_with === '',
            next_time: aboutMeData.next_time === ''
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(error => error);
        return !hasError;
    };

    const changeHandler = (name, value) => {
        setInputData({
            ...aboutMeData,
            [name]: value
        })
    }

    const nextHandler = () => {
        if (validateFields()) {
            navigation.navigate('upload-id', { data: { ...data, ...aboutMeData, phone } });
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
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name={'arrow-back-outline'} size={25} color={'#000'} />
                    </Pressable>
                    <Text style={styles.welcomeText}>About Me</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <Text style={styles.label}>A Fun Fact About me</Text>
                        <Input error={errors.fun_fact} placeholder={'Enter'} name="fun_fact" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>Next Place I want to travel to</Text>
                        <Input error={errors.next_place} placeholder={'Enter'} name="next_place" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>My Favorite Movie</Text>
                        <Input error={errors.movie} placeholder={'Enter'} name="movie" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>A Fear I have</Text>
                        <Input error={errors.fear_detail} placeholder={'Enter'} name="fear_detail" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>Something I can't live without</Text>
                        <Input error={errors.live_without} placeholder={'Enter'} name="live_without" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>Something I am obsessed with</Text>
                        <Input error={errors.obsessed_with} placeholder={'Enter'} name="obsessed_with" onChangeText={changeHandler} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>I want to do This next time</Text>
                        <Input error={errors.next_time} placeholder={'Enter'} name="next_time" onChangeText={changeHandler} />
                    </View>
                    <Pressable style={styles.signInBtn} onPress={nextHandler}>
                        <LinearGradient colors={['#9F5F91', '#582C57']} style={styles.signInBtn}>
                            <Text style={styles.btnText}>NEXT</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AboutMe

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
    }
})