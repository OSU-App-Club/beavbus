import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RootBottomTabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import { TopBar } from "../components";
import SettingsScreen from "../screens/SettingsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Tab = createBottomTabNavigator<RootBottomTabParamList>();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        lazy: false,
        header: () => <TopBar />,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName:
            | "bus"
            | "bus-outline"
            | "heart"
            | "heart-outline"
            | "settings"
            | "settings-outline"
            | "ellipse";

          if (route.name === "HomeTab") {
            iconName = focused ? "bus" : "bus-outline";
          } else if (route.name === "FavoritesTab") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "SettingsTab") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Tab.Navigator>
  );
}

