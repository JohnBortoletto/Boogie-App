import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import idcard from '../../../assets/idcard.png';
import * as ImagePicker from 'expo-image-picker';

const UploadId = ({ navigation, route }) => {
    const { data } = route.params;

    const [image, setImage] = useState(null);
    const [error, setError] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const nextHandler = () => {
        if (!image) {
            setError(true);
            return;
        } else {
            navigation.navigate('ride-preferences', { data: data, image: image })
        }
    }

    console.log(image);

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
                    <View style={styles.idCard}>
                        {image ? <Image style={styles.idCardPic} source={{ uri: image }} /> :
                            <Image style={styles.idCardPic} source={idcard} />}
                    </View>
                    {error && <View>
                        <Text style={styles.errorIdPicture}>Id Picture Required *</Text>
                    </View>}
                    <Pressable style={styles.signUpBtn} onPress={pickImage}>
                        <Text style={styles.signUpText}>UPLOAD NEW ID</Text>
                    </Pressable>
                </View>
                <View style={styles.nextBtnContainer}>
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

export default UploadId

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
        width: "60%",
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
    nextBtnContainer: {
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    idCard: {
        width: "80%",
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: 20,
    },
    idCardPic: {
        width: "100%",
        height: 200
    },
    errorIdPicture: {
        color: "#ff0000",
        fontSize: 14,
        fontFamily: "SFPro-400",
        textAlign: "left"
    }
})