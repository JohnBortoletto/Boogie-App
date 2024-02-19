import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import PinPoint from '../logos/PinPoint.svg';
import Navigation from '../logos/navigation.svg';
import Arrow from '../logos/Arrow.svg';
import axios from 'axios';
import Loader from './loader';
import AlertMessage from './Alert';
import CapacityLogo from '../logos/Capacity.svg';
import CapacityDarkLogo from '../logos/CapacityDark.svg';
import { Dropdown } from 'react-native-element-dropdown';
import { paymentMethods } from '../constants/paymentMethods';
import { LinearGradient } from 'expo-linear-gradient';

const SelectRide = ({ data, changeLocationHandler, findRideHandler }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedService, setSelectedService] = useState({}); // Add this line
    const [paymentMethod, setPaymentMethod] = useState();

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const services = await axios.get(`https://tatjana.stgdev.net/api/service-list`);
                setServices(services.data.data);
            } catch (error) {
                setIsError(true);
                setErrorMessage(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, [])

    const selectItem = (item) => {
        console.log(item);
        setSelectedService(item); // Update the selected service name
    };

    const changeHandler = (value) => {
        setPaymentMethod(value.value);
    }

    const nextHandler = () => {
        if (!selectedService) {
            setIsError(true);
            setErrorMessage('Please select service');
        }
        else if(!paymentMethod){
            setIsError(true);
            setErrorMessage('Please select payment method');
        }else{
            findRideHandler(selectedService, paymentMethod);
        }
    }


    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);
    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
            {loading && <Loader />}
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
            <View style={styles.innerContainer}>
                <Pressable style={styles.inputContainer} onPress={changeLocationHandler}>
                    <PinPoint width={20} height={20} />
                    <View style={styles.line}></View>
                    <TextInput
                        style={[styles.input, { marginRight: 10, color: "#000" }]}
                        defaultValue={data.pickupAddress}
                        editable={false}
                        placeholder="Enter Pickup Point"
                    />
                    <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
                        <Arrow width={20} height={20} />
                        <Text style={{ marginLeft: 10 }}>Now</Text>
                    </Pressable>
                </Pressable>
                <View style={styles.horizontalLine}></View>
                <Pressable style={styles.inputContainer} onPress={changeLocationHandler}>
                    <Navigation width={20} height={20} />
                    <View style={styles.line}></View>
                    <TextInput
                        style={[styles.input, { color: "#000" }]}
                        defaultValue={data.destinationAddress}
                        editable={false}
                        placeholder="Enter Drop off"
                    />
                </Pressable>
                <View style={styles.horizontalListContainer}>
                    <FlatList
                        data={services}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    { backgroundColor: item.name === selectedService.name ? '#582c57df' : '#fff' } // Conditionally change background color
                                ]}
                                onPress={() => selectItem(item)} // Update selected item on press
                            >
                                <Image source={{ uri: item.service_image }} style={styles.image} />
                                <Text style={[styles.serviceName, { color: item.name === selectedService.name ? "#fff" : "#000" }]}>{item.name}</Text>
                                <View style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}>
                                    {item.name === selectedService.name ? <CapacityLogo width={8} height={8} /> : <CapacityDarkLogo width={8} height={8} />}
                                    <Text style={[styles.capacity, { color: item.name === selectedService.name ? "#fff" : "#000" }]}>1-{item.capacity}</Text>
                                </View>
                                <Text style={[styles.baseFare, { color: item.name === selectedService.name ? "#fff" : "#000" }]}>${item.base_fare}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => item.name + index}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={styles.inputPayment}>
                    <Dropdown
                        data={paymentMethods}
                        placeholder='Select Payment Method'
                        labelField={'label'}
                        valueField='value'
                        onChange={changeHandler}
                        style={{ width: '100%', borderBottomColor: '#cec3c3', borderBottomWidth: 1, paddingBottom: 5 }}
                    />
                </View>
                <View style={{ width: "100%", alignItems: "center" }}>
                        <Pressable style={{width: "80%"}} onPress={nextHandler}>
                            <LinearGradient colors={['#9F5F91', '#582C57']} style={styles.signInBtn}>
                                <Text style={styles.btnText}>NEXT</Text>
                            </LinearGradient>
                        </Pressable>
                </View>

            </View>
        </KeyboardAvoidingView>
    )
}

export default SelectRide

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        overflow: "hidden"
    },
    innerContainer: {
        width: "90%",
        alignItems: "center",
        flex: 1,
    },
    heading: {
        fontSize: 22,
    },
    inputContainer: {
        width: "100%",
        // borderWidth: 1,
        // borderColor: "#E2E2E2",
        // borderRadius: 25,
        padding: 10,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
    },
    line: {
        width: 1,
        height: 20,
        backgroundColor: "#E2E2E2",
        marginLeft: 10,
        marginRight: 10
    },
    suggestions: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 1,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        maxHeight: 200,
    },
    item: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#DDDEEE',
        borderRadius: 2,
        alignItems: 'center',
        margin: 5,
    },
    historyContainer: {
        marginTop: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    historyText: {
        fontSize: 18,
        fontFamily: "SFPro-600"
    },
    previousHistoryText: {
        color: "#666",
        fontSize: 14,
        fontFamily: "SFPro-400"
    },
    horizontalLine: {
        width: "100%",
        height: 1,
        backgroundColor: "#E2E2E2",
    },
    image: {
        width: 63,
        height: 63,
        borderRadius: 10,
        objectFit: "contain"
    },
    horizontalListContainer: {
        marginTop: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    serviceName: {
        fontSize: 10,
        fontFamily: "SFPro-700"
    },
    capacity: {
        fontSize: 10,
        fontFamily: "SFPro-400",
        marginLeft: 5
    },
    baseFare: {
        fontSize: 12,
        fontFamily: "SFPro-400",
        marginTop: 5
    },
    inputPayment: {
        marginTop: 20,
        width: "90%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    signInBtn: {
        width: "100%",
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
});