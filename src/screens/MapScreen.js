import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  useEffect(() => {
    let subscription;

    (async () => {
      // 1. Minta Izin Akses Lokasi (Wajib)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Izin lokasi ditolak!');
        return;
      }

      // 2. Ambil Lokasi Saat Ini buat inisialisasi awal
      let pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = pos.coords;
      setLocation(pos.coords);

      // 3. Bikin Dummy Data User di Sekitar
      // (Nambahin/ngurangin dikit koordinat asli lu biar posisinya deketan)
      setNearbyUsers([
        { id: '1', name: 'Si A', lat: latitude + 0.002, lng: longitude + 0.002 },
        { id: '2', name: 'Si B', lat: latitude - 0.003, lng: longitude + 0.001 },
        { id: '3', name: 'Si C', lat: latitude + 0.001, lng: longitude - 0.003 },
      ]);

      // 4. Tracking Real-time (kalau lu jalan, markernya ikut gerak)
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10 },
        (newPos) => setLocation(newPos.coords)
      );
    })();

    // WAJIB: Hentikan tracking saat komponen unmount biar nggak nguras baterai
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Mencari lokasi lu bang...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Lingkaran radius 200m di sekitar lu */}
        <Circle
          center={location}
          radius={200}
          fillColor="rgba(56,132,255,0.12)"
          strokeColor="#3884ff"
          strokeWidth={1.5}
        />

        {/* Render Marker buat user dummy */}
        {nearbyUsers.map((user) => (
          <Marker
            key={user.id}
            coordinate={{ latitude: user.lat, longitude: user.lng }}
            title={user.name}
            description="Lagi on nih"
            pinColor="green" // Beda warna biar ketahuan ini user lain
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});