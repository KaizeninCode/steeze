import { firestore } from "@/firebaseCofig";
import { getGameModule } from "@/gameEngine";
import { nhieMildCards } from "@/gameEngine/decks/neverHaveIEver";
import { useRoom } from "@/hooks/useRoom";
import { useRoundState } from "@/hooks/useRoundState";
import { useLocalRoomStore } from "@/state/localRoom";
import { Player, RoundState } from "@/types";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoundEnd = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const isLocal = roomId.startsWith("local-");

  const onlineRoomData = useRoom(isLocal ? null : roomId);
  const onlineRound = useRoundState(isLocal ? null : roomId);
  const localRoom = useLocalRoomStore((state) => state.room);
  const setLocalRoundState = useLocalRoomStore((state) => state.setRoundState);
  const updateLocalPlayers = useLocalRoomStore((state) => state.updatePlayers);

  const room = isLocal ? localRoom : onlineRoomData.room;
  const deckCards = nhieMildCards; // TODO: same deck-selection gap as Gameplay

  if (!room)
    return (
      <SafeAreaView className="flex-1 p-5">
        <Text>Loading room...</Text>
      </SafeAreaView>
    );

  const gameModule = getGameModule(
    room.settings.activeGameId ?? "never-have-i-ever",
  );

  async function persistRoundState(next: RoundState) {
    isLocal
      ? setLocalRoundState(next)
      : await onlineRound.updateRoundState(next);
  }

  async function persistPlayers(updatedPlayers: Player[]) {
    isLocal
      ? updateLocalPlayers(updatedPlayers)
      : await updateDoc(doc(firestore, "rooms", roomId), {
          players: updatedPlayers,
        });
  }

  // Fresh deal. same mode, scores untouched
  async function handlePlayAgain() {
    const fresh: RoundState = {
      roomId,
      currentCardId: null,
      currentReaderId: room!.players[0]?.playerId ?? null,
      responses: [],
      votes: [],
      timerEndsAt: null,
      roundNumber: 0,
    }

    const dealt = gameModule.nextCard(deckCards, fresh)
    await persistRoundState(dealt)
    router.push({pathname: '/gameplay/[roomId]', params: {roomId}})
  }

  // scores reset to zero, then off to pick a new mode
  async function handleSwitchGame() {
    const resetPlayers = room!.players.map(p => ({...p, score: 0}))
    await persistPlayers(resetPlayers)
    router.push({pathname: '/mode-select/[roomId]', params: {roomId}})
  }

  const ranked = [...room.players].sort((a,b) => b.score - a.score)

  return (
    <SafeAreaView className="flex-1 p-5 gap-4">
      <Text className="text-center text-xl">Round Complete</Text>
      <FlatList 
        data={ranked}
        keyExtractor={p => p.playerId}
        renderItem={({item}) => (
          <View className="flex flex-row items-center py-2">
            <Text>{item.displayName}</Text>
            <Text className="font-semibold">{item.score}</Text>
          </View>
        )}
      />
      <Pressable className="py-3 rounded-xl bg-[#1d1b33] items-center" onPress={handlePlayAgain}>
        <Text className="text-white font-medium">Play Another Round</Text>
      </Pressable>
      <Pressable className="py-3 items-center" onPress={handleSwitchGame}>
        <Text className="text-[#1d1b33] font-medium">Switch Game</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default RoundEnd;
