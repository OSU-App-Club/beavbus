import { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, View, Button } from "react-native";
import { borderRadius, spacing } from "../constants";
import { useTheme } from "@react-navigation/native";

import { getLocations } from "../scripts/onSearch";

export default function SearchBar() {
    const [text, onChangeText] = useState("");
    const [locations, onChangeLocations] = useState([]);
    const { colors } = useTheme();

    useEffect(() => {
        const debounce = setTimeout(async () => {
            if (text.length > 2) {
                const result = await getLocations(text);
                onChangeLocations(result);
            } else {
                onChangeLocations([]);
            }
        }, 300) // debounce delay in ms
    }, [text]);

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, {color: colors.text, backgroundColor: colors.background}]}
                onChangeText={onChangeText}
                value={text}
                placeholder={"Search for a location..."}
            />
            <View>
                {locations.map((item, index) => (
                    <Text key={index} style={{color: colors.text}}>
                        {item}
                    </Text>
                ))}
            </View>
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