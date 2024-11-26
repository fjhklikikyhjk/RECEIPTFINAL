import { Slot, Stack } from "expo-router";
import "../../../global.css"; // Ensure this path is correct

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name='Home' options={{ headerShown: false }} />
      <Stack.Screen
        name='[id]'
        options={{
          headerShown: true,
          title: "Receipt",
          animation: "fade_from_bottom",
          animationDuration: 400,
          headerTransparent: true,
          headerBackTitle: "Back",
          headerTintColor: "#FFFFFF",
          presentation: "modal", // Add this line
          tabBarStyle: { display: "none" },
        }}
      />
    </Stack>
  );
}
