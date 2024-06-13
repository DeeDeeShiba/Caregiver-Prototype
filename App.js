//App.js
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Heatmap, Circle } from 'react-native-maps';
import { StyleSheet, View, Image } from 'react-native';
import { db } from './firebase';
import { ref, onValue, off } from 'firebase/database';
import axios from 'axios';

export default function App() {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [buildingCenter, setBuildingCenter] = useState(null);

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
        const latestLocation = locationList[locationList.length - 1];
        setCurrentLocation(latestLocation);
        if (latestLocation) {
          getBuildingCenter(latestLocation.latitude, latestLocation.longitude);
        }
      }
    };

    onValue(locationRef, onLocationChange);

    // Cleanup subscription on unmount
    return () => {
      off(locationRef, 'value', onLocationChange);
    };
  }, []);

  const getBuildingCenter = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBSxFbm2MTSWjPZW7qSIcJYsntXB0JH0AU`
      );
      const results = response.data.results;
      if (results.length > 0) {
        const location = results[0].geometry.location;
        setBuildingCenter({
          latitude: location.lat,
          longitude: location.lng,
        });
      }
    } catch (error) {
      console.error('Error fetching building center:', error);
    }
  };

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

        {buildingCenter && (
          <Circle
            center={buildingCenter}
            radius={100} // Define the radius as per your requirement
            strokeWidth={1}
            strokeColor={'#1a66ff'}
            fillColor={'rgba(230,238,255,0.5)'}
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