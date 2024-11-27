import { Slot, Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='introFlowOne' options={{ headerShown: false }} />
      <Stack.Screen name='signUpPage' options={{ header: false }} />
    </Stack>
  );
}
