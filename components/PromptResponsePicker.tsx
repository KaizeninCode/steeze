import { Player, RoundState } from "@/types";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  players: Player[];
  roundState: RoundState;
  onSubmit: (playerId: string, answered: boolean) => void;
}

const PromptResponsePicker = ({ players, roundState, onSubmit }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Source of truth check — resets naturally when currentCardId changes,
  // since responses for a new card start empty.
  const recordedResponse = roundState.responses.find(
    (r) => r.responseCardId === roundState.currentCardId
  );

  if (recordedResponse) {
    const respondedPlayer = players.find((p) => p.playerId === recordedResponse.playerId);
    return (
      <SafeAreaView className="p-5 items-center">
        <Text className="text-center text-base">
          {respondedPlayer?.displayName} {recordedResponse.text === "drank" ? "drank" : "answered"} ✓
        </Text>
        <Text className="text-center text-[#888] text-sm mt-2">Tap "Next Card" to continue</Text>
      </SafeAreaView>
    );
  }

  if (!selectedId) {
    return (
      <SafeAreaView className="flex-1 p-5">
        <Text>Who's answering?</Text>
        {players.map((p) => (
          <Pressable
            className="p-3 rounded-xl bg-[#f1efeb]"
            key={p.playerId}
            onPress={() => setSelectedId(p.playerId)}
          >
            <Text className="text-center">{p.displayName}</Text>
          </Pressable>
        ))}
      </SafeAreaView>
    );
  }

  const selected = players.find((p) => p.playerId === selectedId);

  return (
    <SafeAreaView>
      <Text className="text-[#888] text-center text-[14px] mb-5">
        {selected?.displayName}, answer or drink?
      </Text>
      <View className="flex flex-row gap-2.5 w-full">
        <Pressable
          className="flex-1 p-3 rounded-lg bg-[#2e7d32]"
          onPress={() => { onSubmit(selectedId, true); setSelectedId(null); }}
        >
          <Text className="text-center text-white">Answered</Text>
        </Pressable>
        <Pressable
          className="flex-1 py-3 rounded-lg items-center bg-[#c0392b]"
          onPress={() => { onSubmit(selectedId, false); setSelectedId(null); }}
        >
          <Text className="text-center text-white">Drank</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PromptResponsePicker;