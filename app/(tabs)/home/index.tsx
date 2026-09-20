import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const tileLabels = [
  "Most Likely To",
  "Never Have I Ever",
  "Truth or Drink",
  "How Well Do You Know Me?",
];

const shuffle = (values: number[]) => {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

const Home = () => {
  const router = useRouter();
  const randomizeOrder = true;
  const [labels, setLabels] = useState(tileLabels);
  const [traversalOrder] = useState(() =>
    randomizeOrder ? shuffle([0, 1, 2, 3]) : [0, 1, 3, 2],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLabels((currentLabels) => {
        const nextLabels = [...currentLabels];
        const lastTile = traversalOrder[traversalOrder.length - 1];

        for (let index = traversalOrder.length - 1; index > 0; index -= 1) {
          nextLabels[traversalOrder[index]] =
            currentLabels[traversalOrder[index - 1]];
        }

        nextLabels[traversalOrder[0]] = currentLabels[lastTile];
        return nextLabels;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [traversalOrder]);

  const renderTile = (tileIndex: number, className: string) => (
    <View className={className}>
      <Animated.Text
        key={labels[tileIndex]}
        entering={FadeInUp.duration(4000).springify(4000)}
        className="my-auto text-center text-xl font-alfa text-dark"
      >
        {labels[tileIndex]}
      </Animated.Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <Text className="mt-12 text-center text-6xl font-alfa text-light">
        STEEZE
      </Text>
      <View className="flex-1 justify-center flex-col gap-4 my-16 mx-8 rounded-lg">
        <View className="flex flex-row gap-4">
          {renderTile(
            0,
            "rounded-lg p-2 w-3/5 aspect-square bg-light",
          )}
          {renderTile(1, "rounded-lg p-2 w-2/5 bg-light")}
        </View>
        <View className="flex flex-row gap-4">
          {renderTile(2, "rounded-lg p-2 w-2/5 bg-light")}
          {renderTile(
            3,
            "rounded-lg p-2 w-3/5 aspect-square bg-light",
          )}
        </View>
      </View>
      <Pressable
        onPress={() => router.navigate("/home/create-join")}
        className="bg-light px-3 py-2 rounded-xl w-3/5 mx-auto mb-auto"
      >
        <Text className="text-center text-2xl font-alfa text-dark">
          Get Started
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Home;
