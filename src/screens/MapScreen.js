// screens/MapScreen.js
import { View, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';

export default function MapScreen() {
	const { loc, error } = useLocation();

	if (error) return <Text>{error}</Text>;
	if (!loc) return <Text>Mengambil lokasi...</Text>;

	return (
		<MapView
			style={{ flex: 1 }}
			showsUserLocation={true}
			region={{
				latitude: loc.latitude,
				longitude: loc.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			}}
		>
			{/* Pin posisi user */}
			<Marker
				coordinate={loc}
				title="Posisi Saya"
				description="Lokasi saat ini"
			/>
			{/* Lingkaran radius 200m */}
			<Circle
				center={loc}
				radius={200}
				fillColor="rgba(56,132,255,0.12)"
				strokeColor="#3884ff"
				strokeWidth={1.5}
			/>
		</MapView>
	);
}