import { GAME_CONFIGS } from "@/utils";
import { GameModule } from "./../GameModule";

export const howWellDoYouKnowMeModule: GameModule = {
  config: GAME_CONFIGS["how-well-do-you-know-me"],
  nextCard(deckCards, round, players) {
    const usedIds = new Set(round.usedCardIds);
    const next = deckCards.find((c) => !usedIds.has(c.id));
    /* rotate the subject one player per card - reusing currentReaderId to mean "who is on the spot?" rather than adding a new field*/
    const nextIndex = round.roundNumber % (players.length || 1);
    const nextSubjectId = players[nextIndex]?.playerId ?? null;

    return {
      ...round,
      currentCardId: next?.id ?? null,
      usedCardIds: next ? [...round.usedCardIds, next.id] : round.usedCardIds,
      currentReaderId: nextSubjectId,
      subjectAnswerText: null, // clearedfor the next card
      responses: [], // clear responses for the next
      roundNumber: round.roundNumber + 1,
    };
  },
  handleAction(round, playerId, payload) {
    const { text } = payload as { text: string };

    // the subject submitting their real answer
    if (playerId === round.currentReaderId) {
      return { ...round, subjectAnswerText: text };
    }

    // everyone else guessing. replace their prior guess if they change it
    const responses = round.responses.filter(
      (r) =>
        r.playerId === playerId && r.responseCardId === round.currentCardId,
    );

    return {
      ...round,
      responses: [
        ...responses,
        {
          playerId,
          responseCardId: round.currentCardId,
          text,
        },
      ],
    };
  },
  applyScoring(players, round) {
    if (round.subjectAnswerText === null) return players; // subject never answered

    // penalty-count: players who chose 'drank' instead of answering get the penalty tick
    const correctGuesserIds = new Set(
      round.responses
        .filter(
          (r) =>
            r.text === round.subjectAnswerText &&
            r.responseCardId === round.currentCardId &&
            r.playerId !== round.currentReaderId
        )
        .map((r) => r.playerId),
    );
    return players.map((p) =>
      correctGuesserIds.has(p.playerId) ? { ...p, score: p.score + 1 } : p,
    );
  },
  isRoundOver(round, deckCards) {
    return (
      round.currentCardId === null ||
      round.usedCardIds.length >= deckCards.length
    );
  },
};
