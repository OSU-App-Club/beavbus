import { useState } from "react";
import { TextInput, StyleSheet, View, Button } from "react-native";
import { borderRadius, spacing } from "../constants";
import { useTheme } from "@react-navigation/native";

import { getLocations } from "../scripts/onSearch";

export default function SearchBar() {
    const [text, onChangeText] = useState("");
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, {color: colors.text, backgroundColor: colors.background}]}
                onChangeText={onChangeText}
                value={text}
                placeholder={"Search for a location..."}
            />
            <Button onPress={async () => {
                await getLocations("");
            }} title="Test Press">
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '85%',
    },
    input: {
        padding: spacing.md,
        width: 'auto',
        flex: 1,
        borderRadius: borderRadius.full,
    }
})