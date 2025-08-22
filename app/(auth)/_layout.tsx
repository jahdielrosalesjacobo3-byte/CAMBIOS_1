import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="did-setup" />
      <Stack.Screen name="identity-verification" />
      <Stack.Screen name="wallet-creation" />
    </Stack>
  );
} 