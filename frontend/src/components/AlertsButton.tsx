import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Linking, Pressable, StyleSheet, View } from "react-native";

function openAlerts() {

    try {
        Linking.openURL("https://www.corvallisoregon.gov/news?field_microsite_tid=581");
    } catch(error) {
        Alert.alert('Sorry. Unable to open alerts at this time.')
    }
    
}

function AlertsButton() {

    return(
        <View style={styles.alertsContainer}>
            <Pressable onPress={openAlerts}>
                <Ionicons name="warning-outline" style={styles.alertsIcon} />
            </Pressable>
        </View>
    )
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
        bottom: 120,
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AlertsButton;