import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons'; // Import Icon bawaan Expo

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  
    shouldPlaySound: true,  
    shouldSetBadge: true,   
  }),
});

const Tab = createBottomTabNavigator();
const prefix = Linking.createURL('/');
const linkingConfig = {
  prefixes: [prefix, 'socialapp://'], 
  config: { screens: { Home: 'home', Camera: 'camera', Map: 'map', Profile: 'profile' } },
};

export default function App() {
  return (
    <NavigationContainer linking={linkingConfig}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Logika buat ganti icon pas tab diklik
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Camera') iconName = focused ? 'camera' : 'camera-outline';
            else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1a1a1a', // Warna item saat aktif (elegan dark)
          tabBarInactiveTintColor: '#8e8e93', // Warna item ga aktif
          tabBarStyle: { paddingBottom: 5, height: 60 },
          headerStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderColor: '#f0f0f0' },
          headerTitleStyle: { fontWeight: '800', fontSize: 20, color: '#1a1a1a' },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}