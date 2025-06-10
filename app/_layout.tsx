import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  SplashScreen.hideAsync();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}> {/* Ocultar el header globalmente */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        {/* Otras pantallas sin tab bar */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
  
  
}
