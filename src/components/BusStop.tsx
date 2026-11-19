import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "expo-router/react-navigation";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import { borderRadius, spacing, typography } from "../constants";
import { Stop } from "../hooks/getBusData";
import { Marker } from "react-native-maps";
import { useState } from "react";

export default function BusStop(
    { stop, onClickStop, markerSize }: {
        stop: Stop;
        onClickStop: (stop: Stop) => void;
        markerSize: number;
    },
) {
    const [showDetails, setShowDetails] = useState(false);
    const { colors } = useTheme();

    return (
        <Marker
            key={stop.StopID}
            coordinate={{
                latitude: stop.Latitude,
                longitude: stop.Longitude,
            }}
            onPress={() => setShowDetails(!showDetails)}
            anchor={{ x: 0.5, y: 0.5 }}
        >
            <View
                style={styles.box}
                collapsable={false}
            >
                <ThemedView
                    style={[
                        styles.dot,
                        { width: markerSize, height: markerSize },
                    ]}
                />
                {showDetails && (
                    <View
                        style={[
                            styles.popup,
                            { bottom: 32 + markerSize / 2 + spacing.xs },
                        ]}
                    >
                        <View
                            style={[
                                styles.bubble,
                                { backgroundColor: colors.background },
                            ]}
                        >
                            <ThemedText
                                variant="label"
                                numberOfLines={2}
                                style={styles.label}
                            >
                                {stop.SignVerbiage}
                            </ThemedText>
                        </View>
                        <View
                            style={[
                                styles.arrow,
                                { borderTopColor: colors.background },
                            ]}
                        />
                    </View>
                )}
            </View>
        </Marker>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 64,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
    },
    dot: {
        backgroundColor: "rgb(219, 104, 10)",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: borderRadius.full,
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 3,
    },
    popup: {
        position: "absolute",
        width: 160,
        alignItems: "center",
    },
    bubble: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.sm,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    label: {
        fontWeight: typography.weights.semibold,
        textAlign: "center",
    },
    arrow: {
        width: 0,
        height: 0,
        marginTop: -1,
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderTopWidth: 7,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },
});
