import { Card, Deck } from './../../types/index';

export const truthOrDrinkDeck: Deck = {
  id: 'tod-mild-v1',
  title: 'Truth or Drink - Mild',
  description: 'Answer honestly, or take the penalty',
  compatibleGameIds: ['truth-or-drink'],
  tier: 'free',
  ownerId: null,
  isPublic: true,
  contentRating: 'mild',
  cardCount: 15,
  createdAt: Date.now()
}

const prompts = [
  'the most embarrassing thing in your search history?',
  'a lie you\u2019ve told that you never got caught for?',
  'the last person you stalked on social media?',
  'the worst gift you\u2019ve ever received and pretended to like?',
  'something you\u2019re glad your parents don\u2019t know about?',
  'the pettiest reason you\u2019ve ended a friendship?',
  'a rumour you started that got out of hand?',
  'the most trouble you\u2019ve been in at work or school?',
  'a secret talent nobody in this room knows about?',
  'the last thing you cried about?',
  'a habit you\u2019d never admit to a stranger?',
  'the worst date you\u2019ve been on?',
  'something you\u2019ve stolen, even something small?',
  'a text you sent to the wrong person?',
  'the closest you\u2019ve gotten to getting fired?',
]

export const truthOrDrinkCards: Card[] = prompts.map((text, i) => ({
  id: `tod-mild-${String(i + 1).padStart(2, '0')}`,
  deckId: 'tod-mild-v1',
  type: 'prompt',
  text: `What\u2019s ${text}`
}))
