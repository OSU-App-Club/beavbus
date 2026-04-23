import {Text, View, Pressable, StyleSheet} from "react-native";
import { useTheme } from "@react-navigation/native";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import { borderRadius } from "../constants";



function BusStop({name}: {name: string}) {
    const { colors } = useTheme();
    return(
        <ThemedView style={styles.card}>
            <ThemedText>{name}</ThemedText>
            <Pressable onPress={() => {}}
            style={ ({pressed}) => [styles.button,
                {
                    backgroundColor: pressed? colors.busStopCardBgPressed : colors.busStopCardBg
                }]
            }>
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    card: {
        display: 'flex',
    },

    button: {
        width: 100,
        
        borderRadius: 5,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        height: 50,
        backgroundColor: 'yellow',
        
    }
});
export default BusStop;