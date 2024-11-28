import { Slot, Stack } from "expo-router";
import "../global.css"; // Ensure this path is correct
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const SUPABASE_URL = "https://dgiccoypzfmludulwvwx.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaWNjb3lwemZtbHVkdWx3dnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODk0MTYsImV4cCI6MjA0ODM2NTQxNn0.tYOJj86nS6G0gjA-1hllDK4jOefjsfFgepqzWpOI0ag";

  // Consider adding storage and other options
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage, // Make sure to import AsyncStorage
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  const router = useRouter();

  async function getUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log(user, "current user");

      if (error) {
        router.replace("/(signUpFlow)/signUpPage");
        return;
      }

      if (!user) {
        router.replace("/(signUpFlow)/signUpPage");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      router.replace("/(signUpFlow)/signUpPage");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  // Rest of your component
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(signUpFlow)' options={{ headerShown: false }} />
    </Stack>
  );
}
