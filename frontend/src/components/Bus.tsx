import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Callout, MarkerAnimated } from "react-native-maps";

interface Bus {
    id: string,
    routeId: number,
    coordinate: {
        latitude: number,
        longitude: number
    }
}

// FIXME: We really should recolour each image per what the hexadecimal colour code is
// FIXME: Better APIs for bus data -- update the server please.

// Icon for each route
const route54 = require('../assets/images/blue.png');
const route49 = require('../assets/images/yellow.png');
const route55 = require('../assets/images/green.png');

function Bus({ bus, coordinate }: { bus: Bus, coordinate: any }) {
    const { colors } = useTheme();

    // FIXME: When the coordinate changes, hide the callout
    // FIXME: Centre the map on this button when pressed

    const height = 100;
    const styles = StyleSheet.create({
        customView: {
            width: 140,
            height: height,
        },
        bubble: {
            flexDirection: 'column',
            alignSelf: 'flex-start',
            width: 140,
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 6,
            borderColor: colors.primary,
            borderWidth: 2,
            height: height - 20,
        },
        arrowBorder: {
            backgroundColor: 'transparent',
            borderWidth: 16,
            borderColor: 'transparent',
            borderTopColor: colors.primary,
            alignSelf: 'center',
            marginTop: 0,
        },
        });

    return (
        <MarkerAnimated
            coordinate={coordinate}
            image={bus.routeId === 49 ? route49 : bus.routeId === 55 ? route55 : route54}
        >
            <Callout tooltip style={styles.customView}>
                <View style={styles.bubble}>
                    {/* Any contents must go in here */}
                    <Text>Demo Route Name</Text>
                    <Text>Downtown Transit Center -- 27 min</Text>
                </View>
                <View style={styles.arrowBorder} />
            </Callout>
        </MarkerAnimated>
    )
};

export default Bus;