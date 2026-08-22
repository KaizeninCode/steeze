import PromptResponsePicker from "@/components/PromptResponsePicker";
import SoloRevealChecklist from "@/components/SoloRevealChecklist";
import VoteList from "@/components/VoteList";
import { auth, firestore } from "@/firebaseCofig";
import { getGameModule } from "@/gameEngine";
import { getDeckCards } from "@/gameEngine/decks";
import { useRoom } from "@/hooks/useRoom";
import { useRoundState } from "@/hooks/useRoundState";
import { useLocalRoomStore } from "@/state/localRoom";
import { Player, RoundState } from "@/types";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Gameplay = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const isLocal = roomId.startsWith("local-");
  const seedingRef = useRef(false);

  // ALL HOOKS, UNCONDITIONALLY IN THIS ORDER, EVERY RENDER
  const onlineRoomData = useRoom(isLocal ? null : roomId);
  const onlineRound = useRoundState(isLocal ? null : roomId);
  const localRoom = useLocalRoomStore((state) => state.room);
  const localRoundState = useLocalRoomStore((state) => state.roundState);
  const setLocalRoundState = useLocalRoomStore((state) => state.setRoundState);
  const updateLocalPlayers = useLocalRoomStore((state) => state.updatePlayers);

  const room = isLocal ? localRoom : onlineRoomData.room;
  const roundState = isLocal ? localRoundState : onlineRound.roundState;
  const deckCards = getDeckCards(room?.settings.deckIds ?? []);
  const gameModule = getGameModule(
    room?.settings.activeGameId ?? "never-have-i-ever",
  );

  // initialize round state on first mount if none exists yet
  useEffect(() => {
    // console.log(
    //   "round-init effect fired. room:",
    //   !!room,
    //   "roundState:",
    //   !!roundState,
    //   "currentCardId:",
    //   roundState?.currentCardId,
    // );
    if (!room || roundState?.currentCardId || seedingRef.current) return;
    seedingRef.current = true;
    (async () => {
      const initial: RoundState = {
        roomId,
        cardOrder: [],
        usedCardIds: [],
        currentCardId: null,
        currentReaderId: room.players[0]?.playerId ?? null,
        responses: [],
        votes: [],
        timerEndsAt: null,
        roundNumber: 0,
      };
      const withFirstCard = gameModule.nextCard(deckCards, initial);
      // console.log("[Gameplay] seeding first round state:", withFirstCard);
      await persistRoundState(withFirstCard);
      seedingRef.current = false;
    })();
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
    console.log("scored players:", scoredPlayers);
    await persistPlayers(scoredPlayers);

    if (gameModule.isRoundOver(roundState, deckCards)) {
      // navigate to round end as last step
      router.push({ pathname: "/round-end/[roomId]", params: { roomId } });
      return;
    }

    const advanced = gameModule.nextCard(deckCards, roundState);
    console.log("BEFORE advance, currentCardId was:", roundState.currentCardId);
    console.log("AFTER advance, currentCardId is:", advanced.currentCardId);
    console.log("advanced.usedCardIds:", advanced.usedCardIds);
    await persistRoundState(advanced);
  }

  async function handleToggle(playerId: string, hasDone: boolean) {
    if (!roundState) return;
    const updated = gameModule.handleAction(roundState, playerId, { hasDone });
    await persistRoundState(updated);
  }

  async function handleVote(votedForPlayerId: string) {
    if (!roundState) return;
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const updated = gameModule.handleAction(roundState, uid, {
      votedForPlayerId,
    });
    await persistRoundState(updated);
  }

  async function handleTruthResponse(playerId: string, answered: boolean) {
    if (!roundState) return;
    const updated = gameModule.handleAction(roundState, playerId, { answered });
    await persistRoundState(updated);
  }

  if (!room)
    return (
      <SafeAreaView className="flex-1 p-5">
        <Text>Loading room...</Text>
      </SafeAreaView>
    );

  if (deckCards.length === 0)
    return (
      <SafeAreaView className="flex-1 p-5">
        <Text>No deck available for this game yet.</Text>
      </SafeAreaView>
    );

  if (!roundState || !roundState.currentCardId)
    return (
      <SafeAreaView className="flex-1 p-5">
        <Text>Loading round...</Text>
      </SafeAreaView>
    );

  const isVoteIncomplete =
    gameModule.config.primitives.cardFlow === "vote" &&
    roundState!.votes.length < room!.players.length;

  console.log("deckIds:", room.settings.deckIds);
  console.log("deckCards.length:", deckCards.length);
  console.log("roundState.currentCardId:", roundState.currentCardId);
  console.log("roundState.usedCardIds:", roundState.usedCardIds);

  const currentCard = deckCards.find((c) => c.id === roundState.currentCardId);
  console.log("currentCard:", currentCard);

  return (
    <SafeAreaView className="flex-1 p-5 items-center justify-center gap-5">
      <Text className="text-center text-sm text-[#888]">
        {gameModule.config.displayName}
      </Text>
      <Text className="text-center text-2xl">{currentCard?.text}</Text>
      <Pressable
        className={`py-3.5 px-8 rounded-xl  w-3/5 ${isVoteIncomplete ? "bg-[#ccc]" : "bg-[#1d1b33]"}`}
        onPress={handleNextCard}
        disabled={isVoteIncomplete}
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

      {gameModule.config.primitives.cardFlow === "vote" && (
        <>
          <Text className="text-[#888]">
            {roundState.votes.length} / {room.players.length} voted
          </Text>
          <VoteList
            players={room.players}
            roundState={roundState}
            currentPlayerId={auth.currentUser?.uid}
            onVote={handleVote}
          />
        </>
      )}

      {gameModule.config.primitives.cardFlow === "prompt-response" && (
        <PromptResponsePicker
          players={room.players}
          onSubmit={handleTruthResponse}
          roundState={roundState}
        />
      )}
    </SafeAreaView>
  );
};

export default Gameplay;
