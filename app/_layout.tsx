import { SessionProvider } from "@/src/context/ctx";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <SessionProvider>
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Game" />
      <Stack.Screen name="Settings" />
    </Stack>
  </SessionProvider>
}
