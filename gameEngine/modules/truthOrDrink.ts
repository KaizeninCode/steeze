import { GAME_CONFIGS } from "@/utils";
import { GameModule } from "./../GameModule";

export const truthOrDrinkModule: GameModule = {
  config: GAME_CONFIGS["truth-or-drink"],
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
    const { answered, text } = payload as { answered: boolean; text?: string };

    return {
      ...round,
      responses: [
        ...round.responses,
        {
          playerId,
          responseCardId: round.currentCardId,
          text: answered ? (text ?? "") : "drank",
        },
      ],
    };
  },
  applyScoring(players, round) {
    // penalty-count: players who chose 'drank' instead of answering get the penalty tick
    const drankPlayerIds = new Set(
      round.responses
        .filter(r => r.text === 'drank' && r.responseCardId === round.currentCardId)
        .map(r => r.playerId)
    )
    return players.map(p => (drankPlayerIds.has(p.playerId) ? {...p, score: p.score + 1} : p))
  },
  isRoundOver(round, deckCards) {
    return (
      round.currentCardId === null || round.roundNumber >= deckCards.length
    );
  },
};
