import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import IndexScreen from './index'; // Asegúrate de que este componente esté exportado correctamente
import HomeScreen from './home'; // Asegúrate de que este componente esté exportado correctamente
import EditCar from './editCar'; // Asegúrate de que este componente esté exportado correctamente

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator(); // Crear el tab navigator

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  SplashScreen.hideAsync();

  return (
    // Aquí envolvemos todo el contenido dentro del ThemeProvider
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="index"
          component={IndexScreen} // Revisa si está exportado correctamente
          options={{
            tabBarStyle: { display: 'none' }, // Esto oculta la barra de tabs en esta pantalla
          }}
        />
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="editCar" component={EditCar} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
