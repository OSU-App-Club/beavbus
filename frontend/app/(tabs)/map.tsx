import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken('');

// styleURL="mapbox://styles/osuappdevclub/cmhmtkzqx001501srdyprdp9f"

export default function Map() {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera centerCoordinate={[-123.283862, 44.562671]} zoomLevel={14}/>
        </Mapbox.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 600,
    width: 500,
  },
  map: {
    flex: 1
  }
})
