// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



// App.js
// import { APIProvider } from '@vis.gl/react-google-maps';
// import { createRoot } from "react-dom/client";
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import { firebase } from 'firebase/app';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={{
//           latitude: 37.78825,
//           longitude: -122.4324,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

//"AIzaSyBSxFbm2MTSWjPZW7qSIcJYsntXB0JH0AU"


// import React, { useEffect, useState } from 'react';
// import MapView, {Marker} from 'react-native-maps';
// import { StyleSheet, View } from 'react-native';
// import { db } from 'firebase/app';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: 43.468601,
//           longitude: -79.700432,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         >
//           <Marker
//           coordinate={{
//             latitude: 43.468601,
//             longitude: -79.700432,
//           }}
//           title="My Marker"
//           description="This is a description of the marker"
//         />
//         </MapView>
      
//     </View>

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });

import React, { useEffect, useState } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { db } from './firebase';

export default function App() {
  const [location, setLocation] = useState({ latitude: 43.468601, longitude: -79.700432 });

  useEffect(() => {
    const locationRef = db.ref('location'); // Adjust 'location' to your actual database reference
    const onLocationChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    };

    locationRef.on('value', onLocationChange);

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
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="My Marker"
          description="This is a description of the marker"
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