import { Card } from "@/types";
import { nhieMildCards } from "./neverHaveIEver";

export const DECKS_BY_ID: Record<string, Card[]> = {
  'nhie-mild-v1': nhieMildCards,
  // 'nhie-nsfw-v1': [...], TODO: No deck data for this one yet
  // 'most-likely-to-v1': [...], TODO: No deck data for this one yet
  // 'trurh-or-drink-v1': [...], TODO: No deck data for this one yet
}

export const DEFAULT_DECK_BY_GAME: Record<string, string> = {
  'never-have-i-ever': 'nhie-mild-v1'
}

export function getDeckCards(deckIds: string[]): Card[] {
  const id = deckIds[0]
  return id ? (DECKS_BY_ID[id] ?? []) : []
}

