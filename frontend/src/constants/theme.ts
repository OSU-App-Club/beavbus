/**
 * Theme constants for the Roam app
 * Provides consistent styling across the application
 */

import { DefaultTheme, DarkTheme } from "@react-navigation/native";


export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    text: "#000000",
    card: "#f8f8f8",
    primary: '#cf7500ff',
    success: "#1eff00ff",
    border: '#E0E0E0',
  }
}

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#272727",
    text: "#ffffff",
    card: "#1c1c1c",
    primary: '#cf7500ff',
    success: "#1eff00ff",
    border: '#333333',
  }
}

export const spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  full: 9999,
} as const;

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

