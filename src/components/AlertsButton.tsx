import Ionicons from '@expo/vector-icons/Ionicons';
import { useVerticalBarEdgeIOS } from 'expo-status-bar';
import { openBrowserAsync } from 'expo-web-browser';
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
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
    const isDuo = useVerticalBarEdgeIOS() != null;
    const bottomPosition = isDuo ? 24 : Platform.select({
        ios: Math.max(insets.bottom, 80),
        android: 20,
        default: 20,
    });
    const rightPosition = isDuo ? 90 : 20;

    return (
        <View style={[styles.alertsContainer, { bottom: bottomPosition, right: rightPosition }]}>
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