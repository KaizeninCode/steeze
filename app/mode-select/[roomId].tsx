import { firestore } from "@/firebaseCofig";
import { DEFAULT_DECK_BY_GAME } from "@/gameEngine/decks";
import { useRoom } from "@/hooks/useRoom";
import { useLocalRoomStore } from "@/state/localRoom";
import { GAME_CONFIGS, V1_GAME_IDS } from "@/utils";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ModeSelect = () => {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const isLocal = roomId.startsWith("local-");

  // ----- explicit branch, same convention as Lobby -----
  const onlineRoomData = useRoom(isLocal ? null : roomId);
  const localRoom = useLocalRoomStore((state) => state.room);
  const setLocalActiveGame = useLocalRoomStore((state) => state.setActiveGame);

  const room = isLocal ? localRoom : onlineRoomData.room;
  const modes = V1_GAME_IDS.map((id) => GAME_CONFIGS[id]);

  if (!room) return <Text>Loading room...</Text>;

  async function handleSelectMode(gameId: string) {
    const deckId = DEFAULT_DECK_BY_GAME[gameId];
    await updateDoc(doc(firestore, "rooms", roomId), {
      "settings.activeGameId": gameId,
      "settings.deckIds": deckId ? [deckId] : [],
    });
    router.push({ pathname: "/gameplay/[roomId]", params: { roomId } });
  }
  return (
    <SafeAreaView className="flex-1 p-5 gap-16 dark:bg-dark bg-light">
      <Text className="text-center text-2xl font-semibold dark:text-light text-dark font-alfa">Choose a game</Text>
      <FlatList
        data={modes}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <Pressable
            className="p-5 rounded-xl dark:bg-light bg-dark mb-3"
            onPress={() => handleSelectMode(item.id)}
          >
            <Text className="font-medium text-center dark:text-dark text-light font-alfa">{item.displayName}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default ModeSelect;
