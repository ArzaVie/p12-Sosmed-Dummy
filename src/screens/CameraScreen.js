
import { useState, useRef } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraScreen() {
	const [perm, requestPerm] = useCameraPermissions();
	const [photo, setPhoto] = useState(null);
	const [facing, setFacing] = useState('back'); // 'front' | 'back'
	const camRef = useRef(null);

	const takePicture = async () => {
		if (!camRef.current) return;
		const pic = await camRef.current.takePictureAsync({ quality: 0.8 });
		// Resize & kompres sebelum upload ke server
		const resized = await ImageManipulator.manipulateAsync(
			pic.uri,
			[{ resize: { width: 800 } }], // max lebar 800px
			{ compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
		);
		setPhoto(resized.uri);
		console.log('Ukuran setelah resize:', resized.uri);
	};

	const toggleCamera = () => {
		setFacing(f => (f === 'back' ? 'front' : 'back'));
	};

	// Tampilkan tombol minta izin jika belum ada
	if (!perm?.granted) {
		return (
			<View style={styles.center}>
				<Text>Akses kamera diperlukan</Text>
				<Button title="Izinkan Kamera" onPress={requestPerm} />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<CameraView ref={camRef} style={{ flex: 1 }} facing={facing}>
				<View style={styles.controls}>
					<Button title="Balik Kamera" onPress={toggleCamera} />
					<Button title="Ambil Foto" onPress={takePicture} />
				</View>
			</CameraView>
			{photo && <Image source={{ uri: photo }} style={{ height: 200 }} />}
		</View>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	controls: {
		position: 'absolute',
		bottom: 20,
		flexDirection: 'row',
		gap: 10,
	},
});