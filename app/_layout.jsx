import { Slot, Stack } from "expo-router";
import "../global.css"; // Ensure this path is correct

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(signUpFlow)' options={{ header: false }} />
    </Stack>
  );
}
