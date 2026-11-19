import {View, Pressable, StyleSheet} from "react-native";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

type BusStopProps = {
    stop: { name: string, favorited: boolean, id: string },
    onFavorite(): void
}

function BusStop({ stop, onFavorite }: BusStopProps) {
    return(
        <ThemedView style={styles.card}>
            <Pressable style={styles.subcard} onPress={onFavorite}>
                <ThemedText style={styles.subcard}>{stop.name}</ThemedText>
                <View style={[styles.favorite, stop.favorited && styles.favorited]}/>
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2B2B2F',
        padding: 20,
        borderRadius: 12,
        marginBottom: 10,
    },
    subcard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    favorite: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E8782A',
    },
    favorited: {
        backgroundColor: '#E8782A',
    },
    button: {
        width: 100,
        margin: 10,
        borderRadius: 5,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        height: 50,
        backgroundColor: 'yellow',
        alignSelf: 'flex-end',
    },
});
export default BusStop;