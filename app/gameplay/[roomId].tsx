import SoloRevealChecklist from "@/components/SoloRevealChecklist";
import { firestore } from "@/firebaseCofig";
import { getGameModule } from "@/gameEngine";
import { nhieMildCards } from "@/gameEngine/decks/neverHaveIEver";
import { useRoom } from "@/hooks/useRoom";
import { useRoundState } from "@/hooks/useRoundState";
import { useLocalRoomStore } from "@/state/localRoom";
import { Player, RoundState } from "@/types";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Gameplay = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const isLocal = roomId.startsWith("local-");

  const onlineRoomData = useRoom(isLocal ? null : roomId);
  const onlineRound = useRoundState(isLocal ? null : roomId);
  const localRoom = useLocalRoomStore((state) => state.room);
  const localRoundState = useLocalRoomStore((state) => state.roundState);
  const setLocalRoundState = useLocalRoomStore((state) => state.setRoundState);
  const updateLocalPlayers = useLocalRoomStore((state) => state.updatePlayers);

  const room = isLocal ? localRoom : onlineRoomData.room;
  const roundState = isLocal ? localRoundState : onlineRound.roundState;

  if (!room)
    return (
      <SafeAreaView className="flex-1 p-5">
        <Text>Loading room...</Text>
      </SafeAreaView>
    );

  const gameModule = getGameModule(
    room.settings.activeGameId ?? "never-have-i-ever",
  );
  const deckCards = nhieMildCards; // -> TODO: pull from room.settings.deckIds once deck selection becomes active

  // initialize round state on first mount if none exists yet
  useEffect(() => {
    if (!room || roundState) return;
    const initial: RoundState = {
      roomId,
      currentCardId: null,
      currentReaderId: room.players[0]?.playerId ?? null,
      responses: [],
      votes: [],
      timerEndsAt: null,
      roundNumber: 0,
    };
    const withFirstCard = gameModule.nextCard(deckCards, initial);
    persistRoundState(withFirstCard);
  }, [room, roundState]);

  async function persistRoundState(next: RoundState) {
    if (isLocal) {
      setLocalRoundState(next);
    } else {
      await onlineRound.updateRoundState(next);
    }
  }

  async function persistPlayers(updatedPlayers: Player[]) {
    if (isLocal) {
      updateLocalPlayers(updatedPlayers);
    } else {
      await updateDoc(doc(firestore, "rooms", roomId), {
        players: updatedPlayers,
      });
    }
  }

  async function handleNextCard() {
    if (!roundState || !room) return;
    // score the card that's about to be left behind
    const scoredPlayers = gameModule.applyScoring(room.players, roundState);
    await persistPlayers(scoredPlayers);

    if (gameModule.isRoundOver(roundState, deckCards)) {
      // navigate to round end as last step
      router.push({pathname: '/round-end/[roomId]', params: {roomId}})
      return;
    }

    const advanced = gameModule.nextCard(deckCards, roundState);
    await persistRoundState(advanced);
  }

  if (!room) return (
      <SafeAreaView className="flex-1 p-5">
        <Text>Loading room...</Text>
      </SafeAreaView>
    );

  if (!roundState || !roundState.currentCardId)
    return (
      <SafeAreaView className="flex-1 p-5">
        <Text>Loading round...</Text>
      </SafeAreaView>
    );

  const currentCard = deckCards.find((c) => c.id === roundState.currentCardId);

  async function handleToggle(playerId: string, hasDone: boolean) {
    if (!roundState) return;
    const updated = gameModule.handleAction(roundState, playerId, { hasDone });
    await persistRoundState(updated);
  }

  return (
    <SafeAreaView className="flex-1 p-5 items-center justify-center gap-5">
      <Text className="text-center text-sm text-[#888]">
        {gameModule.config.displayName}
      </Text>
      <Text className="text-center text-2xl">{currentCard?.text}</Text>
      <Pressable
        className="py-3.5 px-8 rounded-xl bg-[#1d1b33] w-3/5"
        onPress={handleNextCard}
      >
        <Text className="text-white font-medium text-center">Next Card</Text>
      </Pressable>
      {gameModule.config.primitives.cardFlow === "solo-reveal" && (
        <SoloRevealChecklist
          players={room.players}
          roundState={roundState}
          onToggle={handleToggle}
        />
      )}
    </SafeAreaView>
  );
};

export default Gameplay;
