import { Tabs } from "expo-router";
import React from "react";
import "../../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#18181B", borderTopWidth: 0 },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Camera",
          tabBarActiveTintColor: "#0000CC",
          tabBarIconStyle: "#0000FF",
          tabBarInactiveTintColor: "#858D92",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='camera' size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='(home)'
        options={{
          title: "Receipts",
          tabBarActiveTintColor: "#0000FF",
          tabBarIconStyle: "#0000FF",
          tabBarInactiveTintColor: "#858D92",
          headerShown: false,

          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='receipt' size={25} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
