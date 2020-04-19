import React, { Component } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text, SafeAreaView, Image } from 'react-native';
import qs from 'qs';
import * as Permissions from 'expo-permissions';
import * as Animatable from "react-native-animatable";
import Geohash from 'latlon-geohash';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

const buildEventsUrl = (geopoint) => {
    let query = qs.stringify({ ...EVENT_QUERY_PARAMS, geoPoint: geopoint, radius: 50 })
    return `${ROOT_URL}${query}`;
};
const ROOT_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?';
const EVENT_QUERY_PARAMS = {
    apikey: 'nkbb8t3zibRRgbAFMb5dDwdanrpbLosd'
};

export default class HomeScreen extends Component {

    static navigationOptions = {
        title: 'All Events',
        headerStyle: {
            backgroundColor: 'black'
        },
        headerTintColor: 'white',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            mapLoaded: false,
            region: {
                latitude: 49.2825,
                longitude: -123.1207,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2
            },
            locationPermission: 'unknown',
            position: 'unknown',
            geoPoint: null,
            keyword: null,
            eventJSON: null,
            eventsLoaded: false,
            searchURL: null
        };
    };

    _geoLocationPermissions = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({ locationPermission: 'false' });
        } else {
            this.setState({ locationPermission: 'true' });
        }
    };

    componentDidMount() {
        // this.setState({ mapLoaded: true });
        this._geoLocationPermissions();
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    longitudeDelta: 0.2,
                    latitudeDelta: 0.2
                },
                geoPoint: Geohash.encode(this.state.region.latitude, this.state.region.longitude, 9)
            });
            (error) => alert(JSON.stringify(error));
            fetch(buildEventsUrl(this.state.geoPoint), {
                method: 'GET'
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        eventJSON: responseJson._embedded.events,
                        eventsLoaded: true,
                        searchURL: buildEventsUrl(this.state.geoPoint, this.state.keyword, this.state.radius)
                    })
                }).catch((err) => {
                    console.error(err);

                });
        });
    };

    render() {
        if (!this.state.eventsLoaded) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <Text>🤔, looking for events near you... </Text>
                    <ActivityIndicator size='small' />
                </View>
            )
        }

        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <View style={{ alignItems: 'center' }}>
                        <MapView
                            region={this.state.region}
                            style={styles.map}>
                            <Marker coordinate={this.state.region}>
                                <Animatable.View
                                    animation="zoomIn"
                                    easing="linear"
                                    iterationCount="infinite"
                                    style={styles.marker}>
                                </Animatable.View>
                            </Marker>
                            <View style={styles.locationVar}>
                                <Text style={styles.latitudeVar}>Current Latitude: {this.state.region.latitude.toFixed(2)}° N</Text>
                                <Text style={styles.longitudeVar}>Current Longitude: {this.state.region.longitude.toFixed(2)}° W</Text>
                            </View>
                        </MapView>
                        <Text style={{ fontSize: 20, padding: 10 }} color='#0f4c81'>😀, Here's what we've found 👇</Text>
                        <View style={styles.separator}></View>
                    </View>
                    <FlatList
                        data={this.state.eventJSON}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Details', {
                                    eventID: item.id,
                                })}>
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Image
                                                style={styles.listImage}
                                                source={{
                                                    url: item.images[0].url,
                                                }}
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={styles.listItemName}>{item.name}</Text>
                                            <Text style={styles.listItemDistance}>Distance: {item.distance} miles</Text>
                                            <Text style={styles.listItemDistance}>
                                                Venue: {item._embedded.venues[0].name}, {item._embedded.venues[0].city.name}, {item._embedded.venues[0].state.stateCode}, {item._embedded.venues[0].country.countryCode}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.listSeparator}></View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id} />
                </View>
            </SafeAreaView>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    map: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('screen').height * 0.27,
    },
    marker: {
        width: 25,
        height: 25,
        backgroundColor: '#0f4c81',
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 3
    },
    locationVar: {
        width: Dimensions.get('screen').width * 0.9,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.6)'
    },
    latitudeVar: {
        fontSize: 21,
        color: '#0f4c81'
    },
    longitudeVar: {
        fontSize: 21,
        color: '#0f4c81'
    },
    separator: {
        marginBottom: 3,
        borderBottomColor: '#737373',
        borderBottomWidth: 1,
        width: Dimensions.get('screen').width * 0.95
    },
    listImage: {
        width: 70,
        height: 70,
        marginLeft: 5
    },
    listItemName: {
        color: 'black',
        fontSize: 22,
        marginLeft: 5,
        marginRight: 60,
        flex: 1
    },
    listItemDistance: {
        color: 'black',
        fontSize: 15,
        marginLeft: 5,
        marginRight: 100
    },
    listSeparator: {
        marginVertical: 2,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: Dimensions.get('screen').width
    }
});