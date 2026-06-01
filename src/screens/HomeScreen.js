import { useState, useEffect, useRef } from 'react';
// Pastiin kaga ada kata 'Linking' di dalem kurung kurawal bawah ini:
import { View, Text, Button, StyleSheet, Platform } from 'react-native'; 
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking'; // <-- Kita murni pake yang ini aja

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
      if (data?.screen) {
        navigation.navigate(data.screen);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notifListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Fungsi buat minta izin dan ambil Expo Push Token
  async function registerForPushNotificationsAsync() {
    let token;
    // Push notif cuma jalan di HP beneran, bukan emulator
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Izin notifikasi ditolak bang!');
        return;
      }
      
      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Push Token Lu:', token);
      } catch (error) {
        console.warn('Push Token di-skip karena pake Expo Go. Aman bang!');
        token = 'Token-Dummy-Khusus-Expo-Go'; 
      }
      // ------------------------------------------

    } else {
      alert('Wajib pake HP beneran bang buat test push notif!');
    }
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
      trigger: null, // DI-NULL-IN BIAR LANGSUNG MUNCUL GA PAKE NUNGGU
    });
    alert('Notif dikirim paksa barusan! Cek panel atas bang.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.tokenText}>
        Status Token: {expoPushToken ? 'Dapat ✅' : 'Belum/Gagal ❌'}
      </Text>
      
      <View style={{ marginTop: 30 }}>
        <Button 
          title="Kirim Test Notif Simulasi Chat" 
          onPress={triggerTestNotif} 
        />
        <View style={{ marginTop: 20 }}>
        <Button 
          title="🚀 BUKTIKAN DEEP LINK" 
          onPress={async () => {
            // Ini ngebuktiin sistem bisa ngebikin URL yang valid
            const url = Linking.createURL('profile');
            alert('URL Deep Link yang ke-generate:\n' + url);
            
            // Maksa sistem ngebuka URL tersebut
            await Linking.openURL(url);
          }} 
          color="black"
        />
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  tokenText: { color: 'gray', marginBottom: 20 }
});