import { Card, Player, RoundState } from "@/types";
import { Pressable, Text, View } from "react-native";

interface Props {
  currentCard: Card;
  players: Player[];
  roundState: RoundState;
  currentPlayerId: string | undefined;
  onSubmit: (text: string) => void;
}

const SubjectGuessPicker = ({
  currentCard,
  players,
  roundState,
  currentPlayerId,
  onSubmit,
}: Props) => {
  const isSubject = currentPlayerId === roundState.currentReaderId;
  const choices = currentCard.metadata?.choices ?? [];
  const subject = players.find(
    (p) => p.playerId === roundState.currentReaderId,
  );
  const myGuess = roundState.responses.find(
    (r) =>
      r.responseCardId === roundState.currentCardId &&
      r.playerId === currentPlayerId,
  )?.text;

  if (isSubject) {
    if (roundState.subjectAnswerText) {
      return (
        <Text className="text-[#888] text-center">
          Answer locked in. Waiting for guesses...
        </Text>
      );
    }
    return (
      <View className="gap-8 w-full">
        <Text className="text-[#888] text-center">
          Your turn - pick your answer
        </Text>
        {choices.map((choice) => (
          <Pressable
            key={choice}
            className="p-3 rounded-lg bg-[#f1efe8]"
            onPress={() => onSubmit(choice)}
          >
            <Text className="text-center">{choice}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  if (!roundState.subjectAnswerText) {
    return (
      <Text className="text-[#888] text-center">
        Waiting for {subject?.displayName} to answer...
      </Text>
    );
  }

  return (
    <View className="gap-8 w-full">
      <Text className="text-[#888] text-center">
        What do you think {subject?.displayName} said?
      </Text>
      {choices.map((choice) => (
        <Pressable
          key={choice}
          className={`p-3 rounded-lg ${
            myGuess === choice ? "bg-[#1d1b33]" : "bg-[#f1efe8]"
          }`}
          onPress={() => onSubmit(choice)}
        >
          <Text className="text-center">{choice}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default SubjectGuessPicker;
