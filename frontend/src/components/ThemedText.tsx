import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";
import { typography } from "../constants";
import { useTheme } from "@react-navigation/native";


type ThemedTextProps = TextProps & { variant?: "body" | "title" | "label", color?: string };
export default function ThemedText({variant = 'body', color, style, children, ...rest}: ThemedTextProps) {
    const { colors } = useTheme();
    
    return (
        <Text style={[styles[variant], {color: color || colors.text}, style]} {...rest}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    body: {fontSize: typography.sizes.md, fontWeight: typography.weights.regular},
    title: {fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold},
    label: {fontSize: typography.sizes.sm, fontWeight: typography.weights.regular},
})