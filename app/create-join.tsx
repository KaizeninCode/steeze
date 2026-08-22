import { useLocalRoomStore } from "@/state/localRoom";
import { LOCAL_MODE_ENABLED, Player, Room } from "@/types";
import { generateGuestId } from "@/utils";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ensureAuth, firestore } from "../firebaseCofig";

function generateRoomCode(): string {
  // short, human-readable characters. avoid ambiguaous characters like 0/O, I/1
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

const CreateJoinRoom = () => {
  const createLocalRoom = useLocalRoomStore((state) => state.createRoom);

  const router = useRouter();
  const [joinCode, setJoinCode] = useState<string>("");
  const [joining, setJoining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnlineCreate = async () => {
    const uid = await ensureAuth();
    const roomId = generateRoomCode();
    const hostPlayer: Player = {
      playerId: uid,
      displayName: "Host", // --> TODO: Add name editing, fallback to Host
      score: 0,
      isHost: true,
      connected: true,
    };

    const newRoom: Room = {
      id: roomId,
      hostId: uid,
      status: "lobby",
      createdAt: Date.now(),
      settings: {
        mode: "online",
        activeGameId: null,
        deckIds: [],
        playerOrder: [uid],
        currentTurnIndex: 0,
      },
      players: [hostPlayer],
    };
    await setDoc(doc(firestore, "rooms", roomId), newRoom);
    router.push({ pathname: "/lobby/[roomId]", params: { roomId } });
  };

  const handleLocalCreate = async () => {
    const roomId = "local-" + generateRoomCode();
    const hostGuestId = generateGuestId();
    createLocalRoom(roomId, hostGuestId, "Host");
    // console.log("store room after create:", useLocalRoomStore.getState().room);
    router.push({ pathname: "/lobby/[roomId]", params: { roomId } });
  };

  const handleJoin = async () => {
    if (!joinCode) return;
    setJoining(true);
    setError(null);

    const uid = await ensureAuth(); // -> joiners need a uid for their entry in players[]

    const roomId = joinCode.toUpperCase();
    const roomRef = doc(firestore, 'rooms', roomId)
    const snap = await getDoc(doc(firestore, "rooms", roomId));
    setJoining(false);

    if (!snap.exists()) {
      setError("No room found with that code.");
      return;
    }

    const room = snap.data() as Room;
    const alreadyJoined = room.players.some((p) => p.playerId === uid);

    if (!alreadyJoined) {
      const newPlayer: Player = {
        playerId: uid,
        displayName: "Player", // --> TODO: Add name editing, fallback to Player
        score: 0,
        isHost: false,
        connected: true,
      };
      // update only the players array
      await updateDoc(roomRef,{players: arrayUnion(newPlayer)})
    }

    setJoining(false)

    router.push({ pathname: "/lobby/[roomId]", params: { roomId } });
  };

  return (
    <SafeAreaView className="flex-1 flex p-5 justify-center gap-5">
      {LOCAL_MODE_ENABLED && (
        <Pressable
          className="px-3.5 py-6 rounded-lg bg-[#1d1b33]"
          onPress={handleLocalCreate}
        >
          <Text className="text-white font-medium text-center">
            Play Locally (Pass the Phone)
          </Text>
        </Pressable>
      )}
      <Pressable
        className="px-3.5 py-6 rounded-lg bg-[#1d1b33]"
        onPress={handleOnlineCreate}
      >
        <Text className="text-white font-medium text-center">
          Create Online Room
        </Text>
      </Pressable>
      <View className="flex items-center gap-3">
        <Text className="text-slate-900 font-medium">Join Online Room</Text>
        <TextInput
          placeholder="Room Code"
          placeholderTextColor="#000"
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="characters"
          maxLength={5}
          className="text-center border border-[#ccc] rounded-sm p-2.5 w-full"
        />
        <Pressable
          className="px-3.5 py-6 rounded-lg bg-[#1d1b33] w-3/5"
          onPress={handleJoin}
        >
          <Text className="text-white font-medium text-center">
            {joining ? "Joining..." : "Join"}
          </Text>
        </Pressable>
      </View>
      {error && <Text className="text-[#c0392b]">{error}</Text>}
    </SafeAreaView>
  );
};

export default CreateJoinRoom;
