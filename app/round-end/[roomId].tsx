import { firestore } from "@/firebaseCofig";
import { getGameModule } from "@/gameEngine";
import { getDeckCards } from "@/gameEngine/decks";
import { useRoom } from "@/hooks/useRoom";
import { useRoundState } from "@/hooks/useRoundState";
import { useLocalRoomStore } from "@/state/localRoom";
import { Player, RoundState } from "@/types";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoundEnd = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const isLocal = roomId.startsWith("local-");

  const onlineRoomData = useRoom(isLocal ? null : roomId);
  const onlineRound = useRoundState(isLocal ? null : roomId);
  const localRoom = useLocalRoomStore((state) => state.room);
  const setLocalRoundState = useLocalRoomStore((state) => state.setRoundState);
  const updateLocalPlayers = useLocalRoomStore((state) => state.updatePlayers);
  const clearLocalRoundState = useLocalRoomStore(
    (state) => state.clearRoundState,
  );

  const room = isLocal ? localRoom : onlineRoomData.room;
  // console.log("store room before round end:", room);

  const deckCards = getDeckCards(room?.settings.deckIds ?? []);

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
    // console.log('persistRoundState called with:', next);
    if (isLocal) {
      setLocalRoundState(next);
    } else {
      try {
        await onlineRound.updateRoundState(next);
        // console.log('persistRoundState: Firestore write succeeded');
      } catch (err) {
        // console.error('persistRoundState: Firestore write FAILED', err);
      }
    }
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
    //  console.log('[RoundEnd] handlePlayAgain — deckCards.length:', deckCards.length);
    const fresh: RoundState = {
      roomId,
      cardOrder: [],
      usedCardIds: [],
      currentCardId: null,
      currentReaderId: room!.players[0]?.playerId ?? null,
      responses: [],
      votes: [],
      timerEndsAt: null,
      roundNumber: 0,
    };

    const dealt = gameModule.nextCard(deckCards, fresh);
    // console.log('[RoundEnd] dealt:', dealt);
    await persistRoundState(dealt);

    if (isLocal) {
      clearLocalRoundState();
    } else {
      await onlineRound.deleteRoundState();
    }
    router.push({ pathname: "/gameplay/[roomId]", params: { roomId } });
  }

  // scores reset to zero, then off to pick a new mode
  async function handleSwitchGame() {
    const resetPlayers = room!.players.map((p) => ({ ...p, score: 0 }));
    await persistPlayers(resetPlayers);

    if (isLocal) {
      clearLocalRoundState();
    } else {
      await onlineRound.deleteRoundState();
    }
    router.push({ pathname: "/mode-select/[roomId]", params: { roomId } });
  }

  const ranked = [...room.players].sort((a, b) => b.score - a.score);

  return (
    <SafeAreaView className="flex-1 p-5 gap-4 dark:bg-dark bg-light">
      <Text className="text-center text-3xl dark:text-light text-dark font-alfa">Round Complete</Text>
      <FlatList
        data={ranked}
        keyExtractor={(p) => p.playerId}
        renderItem={({ item }) => (
          <View className="flex flex-row gap-5 items-center py-2">
            <Text className="dark:text-light text-dark font-alfa">{item.displayName}</Text>
            <Text className="font-semibold dark:text-light text-dark font-alfa">{item.score}</Text>
          </View>
        )}
      />
      <Pressable
        className="py-3 rounded-xl dark:bg-light bg-dark items-center w-3/5 mx-auto"
        onPress={handlePlayAgain}
      >
        <Text className="dark:text-dark text-light font-medium font-alfa">Play Another Round</Text>
      </Pressable>
      <Pressable className="py-3 items-center" onPress={handleSwitchGame}>
        <Text className="dark:text-light text-dark font-medium font-alfa">Switch Game</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default RoundEnd;
