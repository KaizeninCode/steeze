import { RoundState } from './../../types/index';
import { GAME_CONFIGS } from "@/utils";
import { GameModule } from "./../GameModule";


export const mostLikelyToModule: GameModule = {
  config: GAME_CONFIGS["most-likely-to"],
  nextCard(deckCards, round) {
    const usedIds = new Set(round.usedCardIds);
    const next = deckCards.find((c) => !usedIds.has(c.id));
    return {
      ...round,
      currentCardId: next?.id ?? null,
      usedCardIds: next ? [...round.usedCardIds, next.id] : round.usedCardIds,
      votes: [], // clear votes for next round
      roundNumber: round.roundNumber + 1,
    };
  },
  handleAction(round, playerId, payload) {
    const { votedForPlayerId } = payload as { votedForPlayerId: string };
    // one vote per voter per prompt - replace if they change their mind
    const votes = round.votes.filter(v => v.voterId !== playerId)
    return {
      ...round,
      votes: [...votes, {voterId: playerId, votedForPlayerId}]
    };
  },
  applyScoring(players, round) {
    const tally: Record<string, number> = {}
    round.votes.forEach(v => tally[v.votedForPlayerId] = (tally[v.votedForPlayerId] ?? 0) + 1)
    const maxVotes = Math.max(0, ...Object.values(tally))
    const winners = new Set(Object.keys(tally).filter(id => tally[id] === maxVotes))
    return players.map(p => (winners.has(p.playerId) ? {...p, score: p.score + 1} : p))
  },
  isRoundOver(round, deckCards) {
    return (
      round.currentCardId === null || round.usedCardIds.length >= deckCards.length
    );
  },
};
