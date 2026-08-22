import { GAME_CONFIGS } from "@/utils";
import { GameModule } from "./../GameModule";

export const neverHaveIEverModule: GameModule = {
  config: GAME_CONFIGS["never-have-i-ever"],
  nextCard(deckCards, round) {
    const usedIds = new Set(round.responses.map((r) => r.responseCardId));
    const next = deckCards.find((c) => !usedIds.has(c.id));
    return {
      ...round,
      currentCardId: next?.id ?? null,
      roundNumber: round.roundNumber,
    };
  },
  handleAction(round, playerId, payload) {
    const { hasDone } = payload as { hasDone: boolean };
    const responses = round.responses.filter(r => !(r.playerId === playerId && r.responseCardId === round.currentCardId))
    return {
      ...round,
      responses: [
        ...round.responses,
        {
          playerId,
          responseCardId: round.currentCardId,
          text: hasDone ? "yes" : "no",
        },
      ],
    };
  },
  applyScoring(players, round) {
    const yesPlayerIds = new Set(
      round.responses
        .filter(
          (r) => r.text === "yes" && r.responseCardId === round.currentCardId,
        )
        .map((r) => r.playerId),
    );
    return players.map((p) =>
      yesPlayerIds.has(p.playerId) ? { ...p, score: p.score + 1 } : p,
    );
  },
  isRoundOver(round, deckCards) {
    return (
      round.currentCardId === null || round.roundNumber >= deckCards.length
    );
  },
};
