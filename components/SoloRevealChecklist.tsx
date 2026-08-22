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
    return roundState.responses.find(
      (r) =>
        r.playerId === playerId &&
        r.responseCardId === roundState.currentCardId 
    )?.text;
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
            <Text className="dark:text-light text-dark">{player.displayName}</Text>
            <View className="flex flex-row gap-5">
              <Pressable
                className={`py-2 px-4 rounded-lg ${answer === "yes" ? "dark:bg-light bg-dark" : "bg-[#eee]"}`}
                onPress={() => onToggle(player.playerId, true)}
              >
                <Text className="font-medium dark:text-dark text-light">Yes</Text>
              </Pressable>
              <Pressable
                className={`py-2 px-4 rounded-lg ${answer === "no" ? "dark:bg-light bg-dark" : "bg-[#eee]"}`}
                onPress={() => onToggle(player.playerId, true)}
              >
                <Text className="font-medium dark:text-dark text-light">No</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}
