import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootBottomTabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import { TopBar } from "../components";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator<RootBottomTabParamList>();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        lazy: false,
        header: () => <TopBar />,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Tab.Navigator>
  );
}
