import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import PinPoint from '../logos/PinPoint.svg';
import Navigation from '../logos/navigation.svg';
import Arrow from '../logos/Arrow.svg';

const height = Dimensions.get('window').height;

const HomeModal = ({ nowHandler, currentLocation, onFocusHandler, nextHandler }) => {
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [destinationQuery, setDestinationQuery] = useState('');
    const [places, setPlaces] = useState([]);
    const [placeSelected, setPlaceSelected] = useState(false);
    const [DplaceSelected, setDPlaceSelected] = useState(false);
    const [destinationPlaces, setDestinationPlaces] = useState([]);
    const [destinationPlaceSelected, setDestinationPlaceSelected] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
    const [pickupDetails, setPickupDetails] = useState({});
    const [destinationDetails, setDestinationDetails] = useState({});

    useEffect(() => {
        const fetchPlacesNow = async () => {
            if (query.length > 2 && !placeSelected) {
                const places = await fetchPlaces(query);
                setPlaces(places);
                setShowSuggestions(true);
            }
            else if (query.length === 0) {
                setPlaces([]);
                setShowSuggestions(false);
                setPlaceSelected(false);
                setPickupDetails({});
            }
            else {
                setPlaces([]);
                setShowSuggestions(false);
            }

            if (destinationQuery.length > 2 && !destinationPlaceSelected) {
                const destinationPlaces = await fetchPlaces(destinationQuery);
                setDestinationPlaces(destinationPlaces);
                setShowDestinationSuggestions(true);
            }
            else if (destinationQuery.length === 0) {
                setDestinationPlaces([]);
                setShowDestinationSuggestions(false);
                setDestinationPlaceSelected(false);
                setDestinationDetails({});
            }
            else {
                setDestinationPlaces([]);
                setShowDestinationSuggestions(false);
            }
        };
        fetchPlacesNow();
    }, [query, destinationQuery]);

    const fetchPlaces = async (query) => {
        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&language=en`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json.predictions;
        } catch (error) {
            console.error(error);
            return []; // Return an empty array on error
        }
    };

    const fetchPlaceDetails = async (placeId) => {
        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const json = await response.json();
            if (json.result) {
                const { lat, lng } = json.result.geometry.location;
                return { lat, lng };
                // Here you can do whatever you need with the latitude and longitude
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectPlace = async (place, isDestination = false) => {
        if (isDestination) {
            setDestinationPlaceSelected(true);
            setDestinationQuery(place.description);
            const placeDetails = await fetchPlaceDetails(place.place_id);
            setDestinationDetails(placeDetails);
        } else {
            setPlaceSelected(true);
            setQuery(place.description);
            const placeDetails = await fetchPlaceDetails(place.place_id);
            setPickupDetails(placeDetails);
        }
        setShowSuggestions(false);
        setShowDestinationSuggestions(false);
    };

    const nowsss = async () => {
        setLoading(true);
        await nowHandler();
        setPlaceSelected(true);
        setQuery(currentLocation?.formatted_address);
        const placeDetails = await fetchPlaceDetails(currentLocation.place_id);
        setPickupDetails(placeDetails);
        setLoading(false);
    }


    useEffect(() => {
        if (destinationDetails.lat && pickupDetails.lat && destinationDetails.lng && pickupDetails.lng) {
            const data = {
                pickup: pickupDetails,
                destination: destinationDetails,
                pickupAddress: query,
                destinationAddress: destinationQuery
            }
            nextHandler(data);
        }
    }, [destinationDetails, pickupDetails])

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
            <View style={styles.innerContainer}>
                <Text style={styles.heading}>Where do you want to go?</Text>
                <View style={styles.inputContainer}>
                    <PinPoint width={20} height={20} />
                    <View style={styles.line}></View>
                    <TextInput
                        style={[styles.input, {marginRight: 10}]}
                        value={query}
                        onChangeText={text => { setQuery(text); if (!text) setShowSuggestions(false); }}
                        placeholder="Enter Pickup Point"
                        onFocus={() => onFocusHandler()}
                    />
                    <Pressable onPress={nowsss} style={{ flexDirection: "row", alignItems: "center" }}>
                        {!loading && <Arrow width={20} height={20} />}
                        {loading && <ActivityIndicator animating={loading} size={'small'} color={'#6c6c6c'} />}
                        <Text style={{ marginLeft: 10 }}>Now</Text>
                    </Pressable>
                    {(showSuggestions && !showDestinationSuggestions) && (
                        <FlatList
                            style={styles.suggestions}
                            data={places}
                            keyExtractor={(item) => item.place_id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.item} onPress={() => selectPlace(item)}>
                                    <Text>{item.description}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
                {!showSuggestions && <View style={styles.inputContainer}>
                    <Navigation width={20} height={20} />
                    <View style={styles.line}></View>
                    <TextInput
                        style={styles.input}
                        value={destinationQuery}
                        onChangeText={text => { setDestinationQuery(text); if (!text) setShowDestinationSuggestions(false); }}
                        placeholder="Enter Drop off"
                        onFocus={() => onFocusHandler()}
                    />
                    {showDestinationSuggestions && (
                        <FlatList
                            style={styles.suggestions}
                            data={destinationPlaces}
                            keyExtractor={(item) => item.place_id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.item} onPress={() => selectPlace(item, true)}>
                                    <Text>{item.description}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>}

                {(!showDestinationSuggestions && !showSuggestions) && <View style={styles.historyContainer}>
                    <Text style={styles.historyText}>History</Text>
                    <Text style={styles.previousHistoryText}>Previous History</Text>
                </View>}
            </View>
        </KeyboardAvoidingView>
    );
};

export default HomeModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
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
        borderWidth: 1,
        borderColor: "#E2E2E2",
        borderRadius: 25,
        padding: 14,
        marginTop: 20,
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
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
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
    }
});