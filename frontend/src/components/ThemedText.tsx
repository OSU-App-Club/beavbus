import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";
import { typography } from "../constants";
import { useTheme } from "@react-navigation/native";


type ThemedTextProps = TextProps & { color?: string};
export default function ThemedText({color, style, children, ...rest}: ThemedTextProps) {
    const { colors } = useTheme();
    
    return (
        <Text style={[styles.body, {color: color || colors.text}, style]} {...rest}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    body: {fontSize: typography.sizes.md, fontWeight: typography.weights.regular},
})