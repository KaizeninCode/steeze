import { View, Text, Pressable } from "react-native";
import { Player, RoundState } from "@/types";

interface Props {
  players: Player[];
  roundState: RoundState;
  onToggle: (playerId: string, hasDone: boolean) => void;
}

export default function SoloRevealChecklist({
  players,
  roundState,
  onToggle,
}: Props) {
  const responseFor = (playerId: string) => {
    roundState.responses.find(
      (r) =>
        r.playerId === playerId &&
        r.responseCardId === roundState.currentCardId 
    )?.text;
  };
  const toggleValue = (answer: string) => {
    switch (answer) {
      case "yes":
        return "bg-[#2e7d32]";
        break;
      case "no":
        return "bg-[#c0932b]";
        break;
      default:
        return 'bg-white'
    }
  };

  return (
    <View className="gap-2.5 w-full">
      {players.map((player) => {
        const answer = responseFor(player.playerId);
        return (
          <View
            key={player.playerId}
            className="flex flex-row items-center justify-between gap-5"
          >
            <Text>{player.displayName}</Text>
            <View className="flex flex-row gap-5">
              <Pressable
                className={`py-2 px-4 rounded-lg bg-[#eee] ${toggleValue}`}
                onPress={() => onToggle(player.playerId, true)}
              >
                <Text className="font-medium">Yes</Text>
              </Pressable>
              <Pressable
                className={`py-2 px-4 rounded-lg bg-[#eee] ${toggleValue}`}
                onPress={() => onToggle(player.playerId, true)}
              >
                <Text className="font-medium">No</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}
