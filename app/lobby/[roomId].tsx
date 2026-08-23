import { auth, firestore } from "@/firebaseCofig";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useRoom } from '@/hooks/useRoom'
import { useLocalRoomStore } from "@/state/localRoom";
import { Player } from "@/types";
import { generateGuestId } from "@/utils/index";
import { useRoom } from "@/hooks/useRoom";

const Lobby = () => {
  const router = useRouter();

  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const isLocal = roomId.startsWith("local-");

  // ----- explicit branch: online vs local room source
  const onlineRoomData = useRoom(isLocal ? null : roomId); // pass null so that it never subscribes to local rooms
  const localRoom = useLocalRoomStore((state) => state.room);
  const addLocalPlayer = useLocalRoomStore((state) => state.addPlayer);
  const renameLocalPlayer = useLocalRoomStore((state) => state.renamePlayer);

  const room = isLocal ? localRoom : onlineRoomData.room;
  // console.log('lobby sees room:', room, 'isLocal:', isLocal, 'roomId:', roomId);

  const [newPlayerName, setNewPlayerName] = useState("");

  if (!room) return <Text>Loading room...</Text>;

  const currentPlayerId = isLocal ? room.hostId : auth.currentUser?.uid;
  const isHost = currentPlayerId === room.hostId;

  async function handleAddLocalPlayer() {
    // if (!newPlayerName.trim()) return --> uncomment after adding the name editing logic
    addLocalPlayer({
      playerId: generateGuestId(),
      displayName: newPlayerName.trim(),
      score: 0,
      isHost: false,
      connected: true,
    });
    setNewPlayerName("");
  }

  async function handleRename(playerId: string, name: string) {
    if (isLocal) {
      renameLocalPlayer(playerId, name);
    } else {
      // online - update the matching player entry in the room's players array
      const updated = room!.players.map((p: Player) =>
        p.playerId === playerId ? { ...p, displayName: name } : p,
      );
      await updateDoc(doc(firestore, "rooms", roomId), { players: updated });
    }
  }

  function handleChooseGame() {
    router.push({ pathname: "/mode-select/[roomId]", params: { roomId } });
  }

  return (
    <SafeAreaView className="flex-1 p-5 dark:bg-dark bg-light">
      {!isLocal && (
        <Text className="text-2xl mb-3 font-semibold dark:text-light text-dark text-center font-alfa">Room code: {roomId}</Text>
      )}

      <FlatList
        data={room.players}
        keyExtractor={(p) => p.playerId}
        renderItem={({ item }) => (
          <View className="py-2 dark:bg-light bg-dark rounded-xl space-y-5">
            <Text className="text-md dark:text-dark text-light font-alfa ml-5">
              {item.displayName}
              {item.isHost ? " (host)" : ""}
            </Text>
          </View>
        )}
      />

      {isLocal && (
        <View className="flex flex-row gap-2">
          <TextInput
            placeholder="Add player name"
            placeholderTextColor="#ccc"
            value={newPlayerName}
            onChangeText={setNewPlayerName}
            className="flex-1 border border-[#ccc] rounded-lg p-2.5"
          />
          <Pressable
            className="py-2.5 px-4 rounded-lg dark:bg-light bg-dark"
            onPress={handleAddLocalPlayer}
          >
            <Text className="dark:text-light text-dark">Add</Text>
          </Pressable>
        </View>
      )}

      {isHost && (
        <Pressable
          className="py-2.5 px-4 rounded-lg dark:bg-light bg-dark w-3/5 mx-auto"
          onPress={handleChooseGame}
        >
          <Text className="dark:text-dark text-light text-center font-alfa">Choose a game</Text>
        </Pressable>
      )}
      
    </SafeAreaView>
  );
};

export default Lobby;
