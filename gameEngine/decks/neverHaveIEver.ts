import { Card, Deck } from './../../types/index';

export const nhieMildDeck: Deck = {
  id: 'nhie-mild-v1',
  title: 'Never Have I Ever - Mild',
  description: 'Easygoing icebreakers, safe for a mixed group or first game night.',
  compatibleGameIds: ['never-have-i-ever'],
  tier: 'free',
  ownerId: null,
  isPublic: true,
  contentRating: 'mild',
  cardCount: 20,
  createdAt: Date.now()
}

const mildStatements = [
  '...gone skydiving or bungee jumping.',
  '...cried during a movie in a theatre.',
  '...forgotten someone\u2019s name right after they introduced themselves.',
  '...sung karaoke in front of strangers.',
  '...eaten food off the floor (5 second rule or not).',
  '...pretended to be sick to get out of something.',
  '...gotten lost in a foreign country.',
  '...laughed so hard I snorted.',
  '...sent a text to the wrong person.',
  '...stayed up all night binge-watching a show.',
  '...walked into a glass door.',
  '...fallen asleep in a public place.',
  '...lied about my age.',
  '...gone a full day without checking my phone.',
  '...had a food-related injury while cooking.',
  '...worn mismatched socks on purpose.',
  '...talked to myself out loud in public.',
  '...pretended to know a song I\u2019d never heard.',
  '...tripped and played it off like I meant to.',
  '...used a fake accent to prank someone.',
]

export const nhieMildCards: Card[] = mildStatements.map((text, i) => ({
  id: `nhie-mild-${String(i + 1).padStart(2, '0')}`,
  deckId: 'nhie-mild-v1',
  type: 'statement',
  text: `Never have I ever${text}`
}))
