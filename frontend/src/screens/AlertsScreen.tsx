import { WebView } from 'react-native-webview';
import ThemedView from "../components/ThemedView";

function AlertsScreen() {
    return (
        <ThemedView>
            <WebView source={{ uri: "https://www.corvallisoregon.gov/news?field_microsite_tid=581"}} />
        </ThemedView>
    );
}

export default AlertsScreen