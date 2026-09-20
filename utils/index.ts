import { GameConfig } from './../types/index';

export function generateGuestId(): string {
  return 'guest-' + Math.random().toString(36).slice(2, 10)
}

export const GAME_CONFIGS: Record<string, GameConfig> = {
  'never-have-i-ever': {
    id: 'never-have-i-ever',
    displayName: 'Never Have I Ever',
    primitives: {
      cardFlow: 'solo-reveal',
      scoring: 'penalty-count',
      turnStructure: 'rotate-reader'
    },
    cardTypeRequired: 'statement',
    penaltyLabel: 'Drink / Point',
    roundEndCondition: 'deckExhausted'
  },
  'most-likely-to': {
    id: 'most-likely-to',
    displayName: 'Most Likely To',
    primitives: {
      cardFlow: 'vote',
      scoring: 'points',
      turnStructure: 'rotate-reader'
    },
    cardTypeRequired: 'prompt',
    roundEndCondition: 'deckExhausted'
  },
  'truth-or-drink': {
    id: 'truth-or-drink',
    displayName: 'Truth or Drink',
    primitives: {
      cardFlow: 'prompt-response',
      scoring: 'penalty-count',
      turnStructure: 'rotate-reader'
    },
    cardTypeRequired: 'prompt',
    penaltyLabel: 'Drink / Point',
    roundEndCondition: 'deckExhausted'
  },
  'how-well-do-you-know-me': {
    id: 'how-well-do-you-know-me',
    displayName: 'How Well Do You Know Me',
    primitives: {
      cardFlow: 'guess-reveal',
      scoring: 'points',
      turnStructure: 'rotate-reader'
    },
    cardTypeRequired: 'guess',
    roundEndCondition: 'deckExhausted'
  },
}

export const V1_GAME_IDS = ['never-have-i-ever', 'most-likely-to', 'truth-or-drink', 'how-well-do-you-know-me']