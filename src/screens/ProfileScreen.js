import { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipulated.uri);
    }
  };

  const saveToGallery = async () => {
    if (!image) return;
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Gagal', 'Butuh izin galeri bang!');
      return;
    }
    try {
      const asset = await MediaLibrary.saveToLibraryAsync(image);
      let album = await MediaLibrary.getAlbumAsync('SocialApp');
      if (album) await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      else await MediaLibrary.createAlbumAsync('SocialApp', asset, false);
      Alert.alert('Mantap!', 'Foto masuk galeri HP lu.');
    } catch (error) {
      Alert.alert('Error', 'Gagal nyimpen foto.');
    }
  };

  const shareImage = async () => {
    if (!image) return;
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Gagal', 'Sharing kaga support bang');
      return;
    }
    await Sharing.shareAsync(image, { mimeType: 'image/jpeg', dialogTitle: 'Bagikan via...' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="camera-outline" size={32} color="#1a1a1a" />
        <Text style={styles.title}>Postingan Baru</Text>
        <Text style={styles.subtitle}>Pilih dan sesuaikan foto terbaik lu.</Text>
      </View>

      {!image ? (
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          <Ionicons name="cloud-upload-outline" size={50} color="#8e8e93" />
          <Text style={styles.uploadText}>Tap buat pilih foto dari galeri</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]} onPress={saveToGallery}>
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Simpan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#3884ff' }]} onPress={shareImage}>
              <Ionicons name="share-social-outline" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Bagikan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => setImage(null)}>
            <Ionicons name="trash-outline" size={18} color="#F44336" />
            <Text style={styles.deleteBtnText}>Hapus & Pilih Ulang</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 20 },
  header: { marginBottom: 30, alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: '800', color: '#1a1a1a', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  uploadBox: { height: 250, backgroundColor: '#e9ecef', borderRadius: 15, borderWidth: 2, borderColor: '#ced4da', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  uploadText: { color: '#8e8e93', marginTop: 10, fontWeight: '600' },
  previewContainer: { alignItems: 'center', width: '100%' },
  imagePreview: { width: '100%', height: 350, borderRadius: 15, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, marginHorizontal: 5, elevation: 2 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 5, fontSize: 16 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  deleteBtnText: { color: '#F44336', fontWeight: 'bold', marginLeft: 5, fontSize: 16 }
});