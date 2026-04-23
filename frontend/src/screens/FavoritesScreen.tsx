import React from "react";
import { View, StyleSheet, ScrollView} from "react-native";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import ThemedSwitch from "../components/ThemedSwitch";
import { useTheme } from "@react-navigation/native";
import BusStop from "../components/BusStop";

export default function FavoritesScreen() {
    return (
        <ScrollView>
            <ThemedView>
                <ThemedText variant="title" style={styles.title}>Favorites</ThemedText>
                <BusStop name="SEC"></BusStop>
                <BusStop name="MU"></BusStop>
                <BusStop name="Austin"></BusStop>
                <BusStop name="Sacket"></BusStop>
                <BusStop name="Valley"></BusStop>
                <BusStop name="Radiation Center"></BusStop>
                <BusStop name="MU"></BusStop>
            </ThemedView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        paddingTop: 20,
        paddingBottom: 40,
        paddingLeft: 20,
    }
});