import { GAME_CONFIGS } from "@/utils";
import { GameModule } from "./../GameModule";

export const truthOrDrinkModule: GameModule = {
  config: GAME_CONFIGS["truth-or-drink"],
  nextCard(deckCards, round) {
    const usedIds = new Set(round.usedCardIds);
    const next = deckCards.find((c) => !usedIds.has(c.id));
    return {
      ...round,
      currentCardId: next?.id ?? null,
      usedCardIds: next ? [...round.usedCardIds, next.id] : round.usedCardIds,
      roundNumber: round.roundNumber + 1,
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
      round.currentCardId === null || round.usedCardIds.length >= deckCards.length
    );
  },
};
