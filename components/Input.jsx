import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const Input = ({ placeholder, keyboardType = 'default', secureTextEntry = false, eye, onChangeText, name, editable = true, error }) => {
    const [secureText, setSecureText] = useState(secureTextEntry);
    const [eyeIcon, setEyeIcon] = useState(eye ? 'eye-off' : '');
    const eyePressHandler = () => {
        setSecureText(!secureText);
        setEyeIcon(eyeIcon === 'eye' ? 'eye-off' : 'eye');
    }

    return (
        <View style={styles.parentContainer}>
            <TextInput style={error ? styles.errorContainer : styles.container} name={name} placeholder={placeholder} keyboardType={keyboardType} placeholderTextColor={error? '#970000': "#000"} secureTextEntry={secureText} onChangeText={(e) => onChangeText(name, e)} editable={editable} />
            <Pressable style={styles.eye} onPress={eyePressHandler}>
                <Ionicons name={eyeIcon} size={25} color={'#888888'} />
            </Pressable>
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    parentContainer: {
        position: "relative",

    },
    container: {
        width: '100%',
        color: '#000',
        fontSize: 18,
        fontFamily: "SFPro-400",
        letterSpacing: -0.2,
        borderBottomColor: "#DBDBDB",
        borderBottomWidth: 1,
        paddingBottom: 12
    },
    errorContainer: {
        width: '100%',
        color: '#000',
        fontSize: 18,
        fontFamily: "SFPro-400",
        letterSpacing: -0.2,
        borderBottomColor: "#ff0000",
        borderBottomWidth: 1,
        paddingBottom: 12
    },
    eye: {
        position: 'absolute',
        right: 0
    }
})