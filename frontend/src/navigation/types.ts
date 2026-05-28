import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

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

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootBottomTabParamList {}
  }
}
