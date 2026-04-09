import React from "react";
import { Switch, SwitchProps } from "react-native";
import { useTheme } from "@react-navigation/native";


type ThemedSwitchProps = SwitchProps & {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export default function ThemedSwitch({ value, onValueChange, style, ...rest }: ThemedSwitchProps) {
    const { colors } = useTheme();
    return (
        <Switch
            trackColor={{ false: colors.switchTrackFalse, true: colors.primary }}
            thumbColor={colors.switchThumb}
            ios_backgroundColor={colors.switchTrackFalse}
            onValueChange={onValueChange}
            value={value}
            style={[{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }, style]}
            {...rest}
        />
    )
}