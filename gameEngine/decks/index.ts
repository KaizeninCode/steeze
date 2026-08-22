import { Card } from "@/types";
import { nhieMildCards } from "./neverHaveIEver";
import { mostLikelyToCards } from "./mostLikelyTo";
import { truthOrDrinkCards } from "./truthOrDrink";


export const DECKS_BY_ID: Record<string, Card[]> = {
  'nhie-mild-v1': nhieMildCards,
  // 'nhie-nsfw-v1': [...], TODO: No deck data for this one yet
  'mlt-mild-v1': mostLikelyToCards, 
  // 'mlt-nsfw-v1': [...], TODO: No deck data for this one yet
  'tod-mild-v1': truthOrDrinkCards
  // 'tod-nsfw-v1': [...], TODO: No deck data for this one yet
}

export const DEFAULT_DECK_BY_GAME: Record<string, string> = {
  'never-have-i-ever': 'nhie-mild-v1',
  'most-likely-to': 'mlt-mild-v1',
  'truth-or-drink': 'tod-mild-v1',
}

export function getDeckCards(deckIds: string[]): Card[] {
  const id = deckIds[0]
  return id ? (DECKS_BY_ID[id] ?? []) : []
}

