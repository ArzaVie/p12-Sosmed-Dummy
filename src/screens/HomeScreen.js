import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notifListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notifListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notif Diterima:', notification.request.content.title);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.screen) navigation.navigate(data.screen);
    });
    return () => {
      Notifications.removeNotificationSubscription(notifListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;
      
      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } catch (error) {
        token = 'Token-Dummy-Khusus-Expo-Go'; 
      }
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX, 
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    // -----------------------------------------

    return token;
  }

const triggerTestNotif = async () => {
    await Notifications.scheduleNotificationAsync({
      content: { 
        title: "💬 Chat Baru Masuk!", 
        body: "Woi bang, tugasnya ntar kirim ke gua ya!", 
        data: { screen: 'Profile' },
        sound: true, // Maksa bunyi
      },
      trigger: null, // Bikin langsung muncul kaga pake nunggu
    });
    Alert.alert('Sukses', 'Notif dikirim paksa barusan! Cek panel atas bang.');
  };
  
  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerBox}>
        <Ionicons name="checkmark-circle" size={24} color={expoPushToken ? "#4CAF50" : "#ccc"} />
        <Text style={styles.tokenText}>
          {expoPushToken ? 'Sistem Notif Aktif' : 'Menyiapkan Notif...'}
        </Text>
      </View>

      {/* Card Notifikasi */}
      <View style={styles.card}>
        <Ionicons name="chatbubbles-outline" size={40} color="#3884ff" style={styles.cardIcon} />
        <Text style={styles.cardTitle}>Simulasi Pesan</Text>
        <Text style={styles.cardDesc}>Uji coba local push notification dengan delay 3 detik.</Text>
        
        <TouchableOpacity style={styles.primaryBtn} onPress={triggerTestNotif}>
          <Ionicons name="paper-plane-outline" size={18} color="#fff" />
          <Text style={styles.btnText}>Kirim Test Notif</Text>
        </TouchableOpacity>
      </View>

      {/* Card Deep Link */}
      <View style={styles.card}>
        <Ionicons name="link-outline" size={40} color="#9C27B0" style={styles.cardIcon} />
        <Text style={styles.cardTitle}>Test Deep Linking</Text>
        <Text style={styles.cardDesc}>Buktikan routing scheme aplikasi berjalan normal.</Text>
        
        <TouchableOpacity 
          style={[styles.primaryBtn, { backgroundColor: '#9C27B0' }]} 
          onPress={async () => {
            const url = Linking.createURL('profile');
            await Linking.openURL(url);
          }}
        >
          <Ionicons name="rocket-outline" size={18} color="#fff" />
          <Text style={styles.btnText}>Lompat ke Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 20 },
  headerBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff', padding: 12, borderRadius: 10, elevation: 2 },
  tokenText: { marginLeft: 10, fontWeight: '600', color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardIcon: { marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 5 },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 15, lineHeight: 20 },
  primaryBtn: { backgroundColor: '#3884ff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});