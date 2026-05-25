// hooks/useLocation.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
	const [loc, setLoc] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let subscription;
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setError('Izin lokasi ditolak');
				return;
			}

			// Posisi satu kali
			const pos = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High,
			});
			setLoc(pos.coords);

			// Tracking real-time (setiap pindah 10 meter)
			subscription = await Location.watchPositionAsync(
				{ accuracy: Location.Accuracy.Balanced, distanceInterval: 10 },
				(newPos) => setLoc(newPos.coords)
			);
		})();

		// WAJIB: hentikan tracking saat komponen unmount
		return () => subscription?.remove();
	}, []);

	return { loc, error };
}