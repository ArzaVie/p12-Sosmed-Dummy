import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Linking from 'expo-linking';

// Import screens
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

// --- KONFIGURASI DEEP LINKING ---
const prefix = Linking.createURL('/');

const linkingConfig = {
  prefixes: [prefix, 'socialapp://'], 
  config: {
    screens: {
      Home: 'home',
      Camera: 'camera',
      Map: 'map',
      Profile: 'profile', 
    },
  },
};
// --------------------------------

export default function App() {
  return (
    <NavigationContainer linking={linkingConfig}>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}