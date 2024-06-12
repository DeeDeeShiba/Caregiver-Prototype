//App.js
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Heatmap } from 'react-native-maps';
import { StyleSheet, View, Image } from 'react-native';
import { db } from './firebase';
import { ref, onValue, off } from 'firebase/database';

export default function App() {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

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
        // Update current location for the custom marker to the latest location
        setCurrentLocation(locationList[locationList.length - 1]);
      }
    };

    onValue(locationRef, onLocationChange);

    // Cleanup subscription on unmount
    return () => {
      off(locationRef, 'value', onLocationChange);
    };
  }, []);

  // Debug information to check the heatmap points
  useEffect(() => {
    console.log('Heatmap Points:', locations.map(location => ({
      latitude: location.latitude,
      longitude: location.longitude,
      weight: 1, // You can adjust the weight as needed
    })));
  }, [locations]);


  const heatmapPoints = locations.map(location => ({
    latitude: location.latitude,
    longitude: location.longitude,
    weight: 1, // You can adjust the weight as needed
  }));

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
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title={`Location at ${new Date(currentLocation.timestamp).toLocaleString()}`}
            description={`Lat: ${currentLocation.latitude}, Lng: ${currentLocation.longitude}`}
          >
            <Image
              source={require('./assets/grandma_emoji.png')}
              style={{ width: 50, height: 50 }}
            />
          </Marker>
        )}
        {/* Conditional rendering of Heatmap */}
        {heatmapPoints.length > 0 && (
          <Heatmap
            points={heatmapPoints}
            opacity={0.6}
            radius={20}
            maxIntensity={100}
            gradientSmoothing={10}
            heatmapMode="POINTS_DENSITY"
          />
        )}
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
