import { Image } from "expo-image";
import { useTheme } from "expo-router/react-navigation";
import { useVerticalBarEdgeIOS } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../constants";
import SearchBar from "./SearchBar";


export default function TopBar() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const isDuo = useVerticalBarEdgeIOS() != null;
  const paddingTop = isDuo ? 24 : insets.top;
  const paddingRight = isDuo ? Math.max(insets.right + spacing.xl, 80) : insets.right + spacing.xl;
  return (
    <View style={[styles.container, { paddingTop, paddingRight: insets.right + spacing.xl, paddingLeft: insets.left + spacing.xl, backgroundColor: colors.primary }]}>
      <Image
        source={require("../assets/images/logo.png")}
        style={[styles.logo, { borderColor: colors.border }]}
        priority="high"
        cachePolicy="memory-disk"
      />
      <SearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
  },
});
