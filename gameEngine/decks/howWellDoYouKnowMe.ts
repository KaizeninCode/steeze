import { Card, Deck } from './../../types/index';

export const howWellDeck: Deck = {
  id: 'hwdykm-mild-v1',
  title: 'How Well Do You Know Me - Mild',
  description: 'One player answers about themselves, everyone else guesses.',
  compatibleGameIds: ['how-well-do-you-know-me'],
  tier: 'free',
  ownerId: null,
  isPublic: true,
  contentRating: 'mild',
  cardCount: 12,
  createdAt: Date.now()
}

const questions: {text:string, choices: string[]}[] = [
  {text: 'my dream vacation?', choices: ['Beach', 'Mountains', 'City break', 'Road trip']},
  {text: 'my go-to comfort food?', choices: ['Pizza', 'Ice cream', 'Fries', 'Mac & Cheese']},
  {text: 'my biggest fear?', choices: ['Heights', 'Spiders', 'Public speaking', 'The dark']},
  {text: 'my favorite season?', choices: ['Summer', 'Winter', 'Spring', 'Fall']},
  {text: 'my ideal Friday night?', choices: ['Staying in', 'Out with friends', 'A quiet date', 'Working on a project']},
  {text: 'a skill I wish I had?', choices: ['Singing', 'Cooking', 'A second language', 'Dancing']},
  {text: 'my most-used emoji?', choices: ["😂", "❤️", "👍", "🙄"]},
  {text: 'my spirit animal?', choices: ['Cat', 'Dog', 'Owl', 'Bear']},
  {text: 'my biggest pet peeve?', choices: ['Lateness', 'Loud chewing', 'Bad drivers', 'Interrupting']},
  {text: 'my go-to karaoke song?', choices: ['A pop anthem', 'A power ballad', 'Hip-hop', 'I don\'t do karaoke']},
  {text: 'my favourite way to relax?', choices: ['Reading', 'TV/Movies', 'Exercise', 'Napping']},
]

export const howWellCards: Card[] = questions.map((question, i) => ({
  id: `hwdykm-mild-${String(i + 1).padStart(2, '0')}`,
  deckId: 'hwdykm-mild-v1',
  type: 'guess',
  text: `What\'s ${question.text}`,
  metadata: {choices: question.choices}
}))
