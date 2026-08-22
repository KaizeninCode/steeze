import { Card, Deck } from './../../types/index';

export const mostLikelyToDeck: Deck = {
  id: 'mlt-mild-v1',
  title: 'Most Likely To - Mild',
  description: 'Vote who in the group fits each scenario best.',
  compatibleGameIds: ['most-likely-to'],
  tier: 'free',
  ownerId: null,
  isPublic: true,
  contentRating: 'mild',
  cardCount: 15,
  createdAt: Date.now()
}

const prompts = [
  'become famous?',
  'survive a zombie apocalypse?',
  'become a millionaire?',
  'forget their own birthday?',
  'cry during a movie?',
  'start a business?',
  'move to another country?',
  'sleep through an alarm?',
  'win an argument?',
  'get lost using GPS?',
  'become a chef?',
  'run a marathon?',
  'talk their way out of trouble?',
  'adopt way too many pets?',
  'be late to their own wedding?',
]

export const mostLikelyToCards: Card[] = prompts.map((text, i) => ({
  id: `mlt-mild-${String(i + 1).padStart(2, '0')}`,
  deckId: 'mlt-mild-v1',
  type: 'prompt',
  text: `Who is most likely to ${text}`
}))
