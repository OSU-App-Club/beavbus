import "expo-router/react-navigation";

declare module 'expo-router/react-navigation' {
    export type ExtendedTheme = {
        dark: boolean;
        colors: {
            // Built-in react-navigation colors
            primary: string;
            background: string;
            card: string;
            text: string;
            border: string;
            notification: string;
            // Custom ThemedSwitch colors
            switchTrackFalse: string;
            switchThumb: string;
            busStopCardBgPressed: string;
            busStopCardBg: string;
        };
    };

    export function useTheme(): ExtendedTheme;
}
