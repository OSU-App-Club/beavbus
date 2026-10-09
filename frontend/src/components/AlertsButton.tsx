import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { openBrowserAsync } from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

async function openAlerts() {

    try {
        openBrowserAsync("https://www.corvallisoregon.gov/news?field_microsite_tid=581");
        // Linking.openURL("https://www.corvallisoregon.gov/news?field_microsite_tid=581");
    } catch (error) {
        Alert.alert('Sorry. Unable to open alerts at this time.')
    }

}

function AlertsButton() {
    const insets = useSafeAreaInsets();
    const bottomPosition = Platform.select({
        ios: Math.max(insets.bottom, 80),
        android: 20,
        default: 20,
    });

    return (
        <View style={[styles.alertsContainer, { bottom: bottomPosition }]}>
            <Pressable onPress={openAlerts}>
                <Ionicons name="warning-outline" style={styles.alertsIcon} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    alertsIcon: {
        fontSize: 36,
    },
    alertsContainer: {
        backgroundColor: "yellow",
        color: 'red',
        width: 50,
        height: 50,
        borderRadius: 12,
        position: 'absolute',
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }
});

export default AlertsButton;