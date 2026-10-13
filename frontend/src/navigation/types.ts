import type { BottomTabScreenProps } from "expo-router/js-tabs";

export type RootBottomTabParamList = {
  HomeTab: undefined;
  ElapsedTimeTab: undefined;
  SettingsTab: undefined;
  FavoritesTab: undefined;
};

export type HomeTabScreenProps = BottomTabScreenProps<
  RootBottomTabParamList,
  "HomeTab"
>;
