import { GAME_CONFIGS } from "@/utils";
import { GameModule } from "./../GameModule";

function shuffleCards(ids:string[]): string[] {
  return [...ids].sort(() => Math.random() - 0.5)
}

export const neverHaveIEverModule: GameModule = {
  config: GAME_CONFIGS["never-have-i-ever"],
  nextCard(deckCards, round) {
    const order = round.cardOrder.length > 0 ? round.cardOrder : shuffleCards(deckCards.map(c => c.id))
    const newIndex = round.roundNumber + 1
    const nextId = order[newIndex] ?? null
    return {...round, cardOrder: order, currentCardId: nextId, roundNumber: newIndex}
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
      round.currentCardId === null || round.roundNumber >= round.cardOrder.length - 1
    );
  },
};
