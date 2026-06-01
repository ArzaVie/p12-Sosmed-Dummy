import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  // Layar loading pas ngecek izin
  if (!permission) {
    return <View style={styles.blackBackground} />;
  }

  // Layar kalo izin kamera belum dikasih
  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={60} color="#8e8e93" style={{ marginBottom: 20 }} />
        <Text style={styles.permissionText}>App ini butuh akses kamera lu bang.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.btnText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fungsi puter kamera (depan/belakang)
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Fungsi jepret foto
  async function takePicture() {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setPhoto(data.uri); // Tahan fotonya buat di-preview
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Gagal ngambil foto nih.');
      }
    }
  }

  // Fungsi simpan foto ke galeri
  async function savePhoto() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(photo);
      Alert.alert("Mantap!", "Hasil jepretan lu udah masuk galeri HP.");
      setPhoto(null); // Balik lagi ke mode kamera
    } else {
      Alert.alert("Gagal", "Butuh izin galeri buat nyimpen.");
    }
  }

  // ==========================================
  // TAMPILAN 1: PREVIEW FOTO (HABIS DIJEPRET)
  // ==========================================
  if (photo) {
    return (
      <View style={styles.blackBackground}>
        <Image source={{ uri: photo }} style={styles.previewImage} />
        
        {/* Overlay Tombol Bawah */}
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setPhoto(null)}>
            <Ionicons name="refresh-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Ulangi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]} onPress={savePhoto}>
            <Ionicons name="checkmark-done-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==========================================
  // TAMPILAN 2: KAMERA AKTIF (VIEWFINDER)
  // ==========================================
  return (
    <View style={styles.blackBackground}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        
        <View style={styles.cameraOverlay}>
          {/* Header Kamera */}
          {/* <View style={styles.topControls}>
            <Text style={styles.camTitle}>• VIEW FINDER</Text>
          </View> */}

          {/* Area Tombol Shutter & Flip */}
          <View style={styles.bottomControls}>
            {/* Tombol Flip (Kiri) */}
            <TouchableOpacity style={styles.iconBtn} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Shutter Button (Tengah) */}
            <TouchableOpacity style={styles.shutterRing} onPress={takePicture}>
                <View style={styles.shutterCore} />
            </TouchableOpacity>

            {/* Spacer (Kanan) biar posisinya balance / simetris */}
            <View style={{ width: 48 }} /> 
          </View>
        </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  blackBackground: { flex: 1, backgroundColor: '#000' },
  
  // Style buat layar izin
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f9', padding: 20 },
  permissionText: { fontSize: 16, color: '#333', marginBottom: 20, textAlign: 'center', fontWeight: '600' },
  primaryBtn: { backgroundColor: '#3884ff', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // Style layout Kamera
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between' },
  
  // Header Kamera
  topControls: { padding: 20, paddingTop: 40, alignItems: 'center' },
  camTitle: { color: '#FF3B30', fontWeight: '800', fontSize: 14, letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  
  // Area Shutter & Navigasi
  bottomControls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 40, paddingHorizontal: 20 },
  iconBtn: { padding: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 30 },
  
  // Desain Shutter Button (Ring luar + Tombol dalam)
  shutterRing: { width: 75, height: 75, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  shutterCore: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },

  // Style Layar Preview
  previewImage: { flex: 1, resizeMode: 'contain' },
  previewOverlay: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 30, backgroundColor: 'rgba(0,0,0,0.7)' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#555', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30 },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});