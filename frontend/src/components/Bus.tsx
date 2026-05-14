import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
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

function Bus({ bus, coordinate, map, ref }: { bus: Bus, coordinate: any, map: any, ref: any }) {
    const { colors } = useTheme();
    const calloutRef = useRef<Callout | null>(null);

    const height = 120;
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
            ref={ref}
            onSelect={() => {
                if (map.current) {
                    map.current.animateToRegion(
                        {
                            latitude: bus.coordinate.latitude,
                            longitude: bus.coordinate.longitude,
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03
                        },
                        500
                    )
                }
            }}
            coordinate={coordinate}
            image={bus.routeId === 49 ? route49 : bus.routeId === 55 ? route55 : route54}
        >
            <Callout tooltip style={styles.customView} ref={calloutRef}>
                <View style={styles.bubble}>
                    <Text>Route {bus.routeId}</Text>
                    <Text>Downtown Transit Center -- 27 min</Text>
                </View>
                <View style={styles.arrowBorder} />
            </Callout>
        </MarkerAnimated>
    )
};

export default Bus;