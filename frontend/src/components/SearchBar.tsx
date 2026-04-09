import { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { borderRadius, spacing } from "../constants";
import { useTheme } from "@react-navigation/native";

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