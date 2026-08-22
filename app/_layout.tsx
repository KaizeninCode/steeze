import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      {/* <StatusBar mode='auto'/> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen
          name="create-join"
          options={{ title: "Create or Join" }}
        />
        <Stack.Screen name="lobby/[roomId]" options={{ title: "Lobby" }} />
        <Stack.Screen
          name="mode-select/[roomId]"
          options={{ title: "Choose a Game" }}
        />
        <Stack.Screen name="gameplay/[roomId]" options={{ title: "Playing" }} />
        <Stack.Screen
          name="round-end/[roomId]"
          options={{ title: "End Round" }}
        />
      </Stack>
    </>
  );
}
