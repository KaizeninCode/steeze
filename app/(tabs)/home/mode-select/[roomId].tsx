import PaywallModal from "@/components/PaywallModal";
import { firestore } from "@/firebaseCofig";
import { DEFAULT_DECK_BY_GAME } from "@/gameEngine/decks";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useRoom } from "@/hooks/useRoom";
import { useLocalRoomStore } from "@/state/localRoom";
import { GAME_CONFIGS, V1_GAME_IDS } from "@/utils";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const ModeSelect = () => {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const isLocal = roomId.startsWith("local-");
  const {isOwned, loading} = useEntitlements()
  const [paywallGameId, setPaywallGameId] = useState<string | null>(null)

  // ----- explicit branch, same convention as Lobby -----
  const onlineRoomData = useRoom(isLocal ? null : roomId);
  const localRoom = useLocalRoomStore((state) => state.room);
  const setLocalActiveGame = useLocalRoomStore((state) => state.setActiveGame);

  const room = isLocal ? localRoom : onlineRoomData.room;
  const modes = V1_GAME_IDS.map((id) => GAME_CONFIGS[id]);

  if (!room || loading) return <Text>Loading room...</Text>;

  async function handleSelectMode(gameId: string) {
    const deckId = DEFAULT_DECK_BY_GAME[gameId];
    await updateDoc(doc(firestore, "rooms", roomId), {
      "settings.activeGameId": gameId,
      "settings.deckIds": deckId ? [deckId] : [],
    });
    router.push({ pathname: "/home/gameplay/[roomId]", params: { roomId } });
  }
  return (
    <SafeAreaView className="flex-1 p-5 gap-5 bg-dark">
      <Text className="text-center text-2xl font-semibold text-light font-alfa">
        Choose a game
      </Text>
        <FlatList
          data={modes}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => {
            const owned = isOwned(item.id)
            return (
            <Pressable
              className={`p-5 rounded-xl bg-light mb-5 aspect-square ${!owned && 'opacity-60'}`}
              onPress={() => handleSelectMode(item.id)}
            >
              <Text className="font-medium text-center text-dark font-alfa">
                {item.displayName}
              </Text>
              {!owned && <Text className="text-[#888] mt-1">🔒 Locked</Text>}
            </Pressable>
          )}}
        />
        {paywallGameId && (
          <PaywallModal
            gameId={paywallGameId}
            onClose={() => setPaywallGameId(null)}
          />
        )}
    </SafeAreaView>
  );
};

export default ModeSelect;
