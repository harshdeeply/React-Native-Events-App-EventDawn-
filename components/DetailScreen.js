import React from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements'
const { findTimeZone } = require('timezone-support')

export default class DetailScreen extends React.Component {
    static navigationOptions = {
        title: 'Event details',
        headerStyle: {
            backgroundColor: 'white'
        },
        headerTintColor: 'black',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            eventDetailsJSON: 'Fetching data...',
            eventDetailsLoaded: false
        };
    };

    componentDidMount() {
        const { navigation } = this.props;
        const eventID = navigation.getParam('eventID');
        console.log('Fetching this time: ' + eventID);
        fetch('https://app.ticketmaster.com/discovery/v2/events/' + eventID + '.json?apikey=nkbb8t3zibRRgbAFMb5dDwdanrpbLosd', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    eventDetailsJSON: responseJson,
                    eventDetailsLoaded: true
                })
            }).catch((err) => {
                alert(err);
            });
    }

    render() {
        if (!this.state.eventDetailsLoaded) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <Text>Hold tight...🤔 </Text>
                    <ActivityIndicator size='small' />
                </View>
            )
        }
        return (
            <Card
                title={this.state.eventDetailsJSON.name}>
                <ScrollView>
                    <Image
                        style={styles.image}
                        resizeMode="cover"
                        source={{ uri: this.state.eventDetailsJSON.images[0].url }}
                    /><View style={styles.head}>
                        <Text style={{ fontSize: 25, textDecorationLine: 'underline' }}>Information about the event: 💁‍♂️</Text>
                    </View>
                    <View style={styles.body}>
                        <Text style={{ fontSize: 22 }}>
                            Genre: {this.state.eventDetailsJSON.classifications[0].genre.name}
                        </Text><View style={styles.listSeparator}></View>
                        <Text style={{ fontSize: 22 }}>
                            Start Time: {this.state.eventDetailsJSON.dates.start.localTime} {findTimeZone('America/Los_Angeles').abbreviations[1]}
                        </Text><View style={styles.listSeparator}></View>
                        <Text style={{ fontSize: 22 }}>
                            Start Date: {(this.state.eventDetailsJSON.dates.start.localDate).slice(0, 16)}
                        </Text><View style={styles.listSeparator}></View>
                        <Text style={{ fontSize: 22 }}>
                            Venue: {this.state.eventDetailsJSON._embedded.venues[0].name}, {this.state.eventDetailsJSON._embedded.venues[0].city.name}, {this.state.eventDetailsJSON._embedded.venues[0].state.stateCode}, {this.state.eventDetailsJSON._embedded.venues[0].country.countryCode}
                        </Text><View style={styles.listSeparator}></View>
                    </View>
                </ScrollView>
            </Card>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: Dimensions.get('screen').width * 0.83,
        height: 200
    },
    body: {
        margin: 10,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    head: {
        margin: 10,
        // fontSize: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    listSeparator: {
        marginVertical: 5,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: Dimensions.get('screen').width
    }
});