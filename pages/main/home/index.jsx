import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import Target1 from '../../../logos/target1.svg'
import BottomSheet from '@gorhom/bottom-sheet';
import HomeModal from '../../../components/HomeModal';
import AlertMessage from '../../../components/Alert';
import { reverseGeocode } from '../../../helpers/reverseGeocode';
import SelectRide from '../../../components/SelectRide';
import { fetchAndDecodeRoute } from '../../../helpers/fetchRoute';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);
    const [radius, setRadius] = useState(10);
    const [currentLocation, setCurrentLocation] = useState({});
    const radiusRef = useRef(radius);
    radiusRef.current = radius;
    const directionRef = useRef(1);
    const [region, setRegion] = useState();
    const mapRef = useRef(null);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%', "65%", "90%"], []);
    const [index, setIndex] = useState(0);
    const [mapHeight, setMapHeight] = useState('50%');
    const [selectRideScreen, setSelectRideScreen] = useState({
        show: false,
        data: {},
    });
    const [findingRide, setFindingRide] = useState(false);

    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const drawRoute = (data) => {
        setLoading(true);
        // console.log(data);
        const origin = { latitude: data.pickup.lat, longitude: data.pickup.lng };
        const destination = { latitude: data.destination.lat, longitude: data.destination.lng };
        fetchAndDecodeRoute(origin, destination)
            .then(coordinates => {
                setRouteCoordinates(coordinates);
                // Optional: Zoom and fit the route within the map
                if (mapRef.current && coordinates.length) {
                    mapRef.current.fitToCoordinates(coordinates, {
                        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                        animated: true,
                    });
                }
                setLoading(false);
            });
    }
    // }, []);


    const goToCurrentLocation = () => {
        if (region) {
            mapRef.current.animateToRegion({
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000);
        }
    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setIsError(true);
            setErrorMessage('Permission to access location was denied');
            return;
        }
        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });

            const curLoc = await reverseGeocode(location.coords.latitude, location.coords.longitude);
            setCurrentLocation(curLoc);

        } catch (error) {
            const status = Location.getProviderStatusAsync();
            if (!status.locationServicesEnabled) {
                setIsError(true);
                setErrorMessage('Please enable location services');
            } else {
                setIsError(true);
                setErrorMessage('Error fetching location');
            }
        }
    }

    useEffect(() => {
        const getLocationC = async () => { await getLocation() };
        getLocationC();
        const intervalId = setInterval(() => {
            let newRadius = radiusRef.current + directionRef.current * 10;
            if (newRadius > 150 || newRadius < 10) {
                directionRef.current *= -1; // Change direction
                newRadius = radiusRef.current + directionRef.current * 10;
            }
            setRadius(newRadius);
        }, 70);
        return () => clearInterval(intervalId);
    }, []);

    const onFocusHandler = () => {
        // bottomSheetRef.current.expand();
        setIndex(2);
    }

    const changeBottomSheetHandler = (index) => {
        setIndex(index);
        if (index === 0 || index === 1)
            Keyboard.dismiss();
    }

    const nextHandler = (data) => {
        if (data) {
            drawRoute(data);
            setSelectRideScreen({
                show: true,
                data: data,
            });
            setIndex(1);
            setMapHeight('35%');
        }
    }

    const changeLocationHandler = () => {
        // bottomSheetRef.current.expand();
        setIndex(2);
        setSelectRideScreen({
            show: false,
            data: {},
        });
        setMapHeight('50%');
        setRouteCoordinates([]);
    }

    const findRideHandler = (service, payment) => {
        console.log(service, payment);
        bottomSheetRef.current?.close();
        setMapHeight('100%');
        setFindingRide(true);
    }

    const cancelRideHandler = () => {
        setFindingRide(false);
        setMapHeight('35%');
    }

    return (
        <View style={{ flex: 1 }}>
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
            {(!region || loading) && <Loader />}
            {currentLocation.address_components?.length > 1 && <Header city={currentLocation.address_components[3]?.long_name} />}
            {region && <MapView
                ref={mapRef}
                style={[styles.map, { height: mapHeight }]}
                region={region}
                showsCompass={true}
                showsMyLocationButton={false}
                showsUserLocation={false}
                provider={PROVIDER_GOOGLE}
                loadingEnabled={true}
                zoomEnabled={true}

            >
                {(!findingRide && routeCoordinates.length === 0) && <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}  ></Marker>}
                {routeCoordinates.length > 0 && (
                    <>
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeWidth={4}
                            strokeColor="#c382c3"
                            lineCap='round'
                        />
                        <Marker coordinate={{ latitude: routeCoordinates[0].latitude, longitude: routeCoordinates[0].longitude }}  ></Marker>
                        <Circle
                            center={{ latitude: routeCoordinates[0].latitude, longitude: routeCoordinates[0].longitude }}
                            radius={10}
                            strokeColor="#A352A3"
                            strokeWidth={2}
                            fillColor="rgb(163, 82, 163)"
                        />
                        <Marker coordinate={{ latitude: routeCoordinates[routeCoordinates.length - 1].latitude, longitude: routeCoordinates[routeCoordinates.length - 1].longitude }}  ></Marker>
                        <Circle
                            center={{ latitude: routeCoordinates[routeCoordinates.length - 1].latitude, longitude: routeCoordinates[routeCoordinates.length - 1].longitude }}
                            radius={10}
                            strokeColor="#A352A3"
                            strokeWidth={2}
                            fillColor="rgb(163, 82, 163)"
                        />
                    </>
                )}



                {(findingRide && routeCoordinates.length > 0) ?
                    <>
                        <Circle
                            center={{ latitude: routeCoordinates[0].latitude, longitude: routeCoordinates[0].longitude }}
                            radius={10}
                            strokeColor="#A352A3"
                            strokeWidth={2}
                            fillColor="rgb(163, 82, 163)"
                        />
                        <Circle
                            center={{ latitude: routeCoordinates[0].latitude, longitude: routeCoordinates[0].longitude }}
                            radius={radius}
                            strokeColor="#A352A3"
                            strokeWidth={1.5}
                            fillColor="rgba(163, 82, 163, 0.35)"
                        />
                    </> :
                    <>
                        {routeCoordinates.length === 0 && <Circle
                            center={{ latitude: region.latitude, longitude: region.longitude }}
                            radius={10}
                            strokeColor="#A352A3"
                            strokeWidth={2}
                            fillColor="rgb(163, 82, 163)"
                        />}
                        {routeCoordinates.length === 0 && <Circle
                            center={region}
                            radius={20}
                            strokeColor="#A352A3"
                            strokeWidth={1.5}
                            fillColor="rgba(163, 82, 163, 0.35)"
                        />}
                    </>
                }
            </MapView>}
            <Pressable style={[styles.locationButton, { bottom: findingRide ? "5%" : "52%" }]} onPress={goToCurrentLocation}>
                <View>
                    <Target1 width={30} height={30} />
                </View>
            </Pressable>
            <View style={[styles.cancelButton, { alignItems: "center" }]}>
                <Pressable style={styles.signInBtn} onPress={cancelRideHandler}>
                    <LinearGradient colors={['#9F5F91', '#582C57']} style={styles.signInBtn}>
                        <Text style={styles.btnText}>Cancel</Text>
                    </LinearGradient>
                </Pressable>
            </View>
            {findingRide && <View style={[styles.findingRideBanner, { alignItems: "center" }]}>
                <View style={styles.signInBtn}>
                    <LinearGradient colors={['#03a773ea', '#079a6bdf']} style={styles.signInBtn}>
                        <Text style={styles.btnText}>Searching for Rides...</Text>
                    </LinearGradient>
                </View>
            </View>}


            {!selectRideScreen.show && <BottomSheet
                ref={bottomSheetRef}
                index={index}
                snapPoints={snapPoints}
                onChange={changeBottomSheetHandler}
            >
                {!selectRideScreen.show && <HomeModal nowHandler={() => {
                    getLocation();
                }} currentLocation={currentLocation} onFocusHandler={onFocusHandler} nextHandler={nextHandler} />}
            </BottomSheet>}
            {(selectRideScreen.data && selectRideScreen.show) && <SelectRide data={selectRideScreen.data} changeLocationHandler={changeLocationHandler} findRideHandler={findRideHandler} />}
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    map: {
        width: '100%',
        // height: '50%',
    },
    customMarker: {
        height: 20,
        width: 20,
        backgroundColor: 'purple',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
    },
    locationButton: {
        position: 'absolute',
        right: 20,
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 20,
    },
    cancelButton: {
        position: 'absolute',
        bottom: '5%',
        width: "100%"
    },
    signInBtn: {
        position: "absolute",
        bottom: "5%",
        width: "70%",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        // marginTop: 30,
    },
    findingRideBanner: {
        position: "absolute",
        top: "12%",
        width: "100%",
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

})