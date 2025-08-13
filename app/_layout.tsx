import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Custom theme untuk SahabatDarurat dengan tema putih konsisten
const SahabatDaruratTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.primary,
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={SahabatDaruratTheme}>
      <AuthProvider>
        <AuthAwareNavigator />
        <StatusBar style="dark" />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AuthAwareNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.background }}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tracking" />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
