import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "@react-navigation/native";


export default function ThemedView({style, children, ...rest}: ViewProps) {
    const { colors } = useTheme();
    
    return (
        <View style={[{backgroundColor: colors.background}, style]} {...rest}>
            {children}
        </View>
    )
}