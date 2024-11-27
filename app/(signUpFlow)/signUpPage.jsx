import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Apple, LogIn } from "lucide-react-native";

export default function AuthScreen() {
  const handleGoogleAuth = () => {
    // Implement Google authentication logic here
    console.log("Google auth pressed");
  };

  const handleAppleAuth = () => {
    // Implement Apple authentication logic here
    console.log("Apple auth pressed");
  };

  return (
    <SafeAreaView className='flex-1 bg-zinc-900'>
      <View className='flex-1 px-6 py-8 justify-between'>
        <View>
          <Text className='text-white text-4xl font-bold mb-4'>Welcome</Text>
          <Text className='text-zinc-400 text-lg mb-8'>
            Sign in to start tracking your expenses
          </Text>
        </View>

        <View className='space-y-4'>
          <TouchableOpacity
            onPress={handleGoogleAuth}
            className='bg-white flex-row items-center justify-center py-4 px-6 rounded-xl'
          >
            <LogIn size={24} color='#000000' className='mr-2' />
            <Text className='text-black text-lg font-semibold'>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAppleAuth}
            className='bg-zinc-800 flex-row items-center justify-center py-4 px-6 rounded-xl'
          >
            <Apple size={24} color='#FFFFFF' className='mr-2' />
            <Text className='text-white text-lg font-semibold'>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        <View className='mt-8'>
          <Text className='text-zinc-500 text-center text-sm'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
