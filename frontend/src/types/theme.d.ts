import '@react-navigation/native';

declare module '@react-navigation/native' {
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
        };
    };

    export function useTheme(): ExtendedTheme;
}
