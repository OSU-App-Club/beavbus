import { Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing, borderRadius } from "../constants";
import { useTheme } from "@react-navigation/native";
import ThemedView from "./ThemedView";

export default function TopBar() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.primary }]}>
      <Image
        source={require("@/src/assets/images/logo.png")}
        style={[styles.logo, { borderColor: colors.border}]}
        fadeDuration={0}
      />
    </ThemedView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
