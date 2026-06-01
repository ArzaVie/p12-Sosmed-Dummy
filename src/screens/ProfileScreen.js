import { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library'; // Tambahan buat nyimpen
import * as Sharing from 'expo-sharing'; // Tambahan buat nge-share

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

  // Fungsi buat nyimpen foto ke galeri (Langkah 7)
  const saveToGallery = async () => {
    if (!image) return;
    
    // Minta izin akses galeri [cite: 541, 542]
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Gagal', 'Butuh izin galeri bang buat nyimpen!');
      return;
    }

    try {
      // Simpan foto ke galeri [cite: 543]
      const asset = await MediaLibrary.saveToLibraryAsync(image);
      
      // Bikin folder/album khusus 'SocialApp' di galeri HP [cite: 544-548]
      let album = await MediaLibrary.getAlbumAsync('SocialApp');
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('SocialApp', asset, false);
      }
      
      Alert.alert('Mantap!', 'Foto berhasil disimpen ke galeri HP lu di album SocialApp.');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Gagal nyimpen foto nih bang.');
    }
  };

  // Fungsi buat nge-share foto ke app lain (Langkah 7)
  const shareImage = async () => {
    if (!image) return;
    
    // Cek apakah HP-nya support fitur sharing [cite: 466, 467]
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Gagal', 'Fitur sharing kaga support di device ini bang');
      return;
    }

    // Buka menu share bawaan HP [cite: 469-471]
    await Sharing.shareAsync(image, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Bagikan hasil editan lu via...',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Postingan Baru</Text>
      
      <Button title="Pilih Foto dari Galeri" onPress={pickImage} />

      {image && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <Text style={styles.caption}>Foto siap disave / dishare!</Text>
          
          <View style={styles.actionButtons}>
            <Button title="💾 Simpan ke HP" onPress={saveToGallery} color="green" />
            <View style={{ width: 10 }} /> {/* Spasi antar tombol */}
            <Button title="📲 Bagikan" onPress={shareImage} color="blue" />
          </View>

          <View style={{ marginTop: 20 }}>
            <Button title="Hapus Foto" color="red" onPress={() => setImage(null)} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  previewContainer: { marginTop: 30, alignItems: 'center' },
  imagePreview: { width: 300, height: 300, borderRadius: 10, marginBottom: 10 },
  caption: { color: 'green', marginBottom: 15, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', marginTop: 10 }
});