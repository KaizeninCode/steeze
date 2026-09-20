import { useEntitlements } from "@/hooks/useEntitlements";
import { GAME_CONFIGS } from "@/utils";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profile = () => {
  const { loading, isOwned } = useEntitlements();

  if (loading) return <ActivityIndicator className="flex-1 p-6" />;

  const allModes = Object.values(GAME_CONFIGS);

  return (
    <SafeAreaView className="flex-1 bg-dark items-center justify-center">
      <Text className="font-alfa text-light text-2xl font-semibold my-4">Your Games</Text>
      <FlatList
        data={allModes}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View className="flex-1 p-6">
            <Text className="">{item.displayName}</Text>
            <Text className={`${isOwned(item.id) ? 'text-[#2e7d32]' : 'text-[#888]'}`}>{isOwned(item.id) ? "Owned" : "Locked"}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default profile;
