//App.js
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Heatmap } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

export default function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const locationRef = ref(db, 'locations'); // Adjust 'locations' to your actual database reference
    const onLocationChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locationList = Object.keys(data).map(key => ({
          key,
          latitude: data[key].latitude,
          longitude: data[key].longitude,
          timestamp: data[key].timestamp,
        }));
        setLocations(locationList);
      }
    };

    onValue(locationRef, onLocationChange);

    // Cleanup subscription on unmount
    return () => {
      locationRef.off('value', onLocationChange);
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.468601,
          longitude: -79.700432,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {locations.map(location => (
          <Marker
            key={location.key}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Location at ${new Date(location.timestamp).toLocaleString()}`}
            description={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
          />
        ))}
        <Heatmap
          points={locations.map(location => ({
            latitude: location.latitude,
            longitude: location.longitude,
            weight: 1, // You can adjust the weight as needed
          }))}
          opacity={0.6}
          radius={20}
          maxIntensity={100}
          gradientSmoothing={10}
          heatmapMode="POINTS_DENSITY"
        />

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});