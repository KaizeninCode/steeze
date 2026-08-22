import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-light dark:bg-dark">
      <View className="flex-1 border-white my-16 mx-8 rounded-lg shadow-md shadow-dark dark:shadow-light"></View>
      <Pressable
        onPress={() => router.navigate("/create-join")}
        className="dark:bg-light bg-dark px-3 py-2 rounded-xl w-3/5 mx-auto mb-16"
      >
        <Text className="text-center text-xl">Get Started</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Home;
