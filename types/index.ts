export type Room = {
  id: string,
  hostId: string,
  status: string,
  createdAt: number,
  settings: {
    mode: string,
    activeGameId: string | null,
    deckIds: string[],
    playerOrder: string[],
    currentTurnIndex: number
  },
  players: Player[],
}

export type Player = {
  playerId: string,
  displayName: string,
  score: number,
  isHost: boolean,
  connected: boolean,
}

export type CardFlow = 'solo-reveal' | 'prompt-response' | 'vote'
export type ScoringMode = 'none' | 'penalty-count' | 'points' | 'timer-race' | 'rule-trigger'
export type TurnStructure = 'rotate-reader' | 'simutaneous' | 'free-for-all'
export type CardType = 'statement' | 'prompt' | 'response' | 'rule' | 'trivia'

export interface GameConfig {
  id: string
  displayName: string
  primitives: {
    cardFlow: CardFlow
    scoring: ScoringMode
    turnStructure: TurnStructure
  }
  cardTypeRequired: CardType
  penaltyLabel?: string
  roundEndCondition: 'deckExhausted' | 'turnLimit' | 'timeLimit'
}

export interface RoundState {
  roomId: string
  cardOrder: string[]
  currentCardId: string | null
  currentReaderId: string | null
  responses: {
    playerId: string 
    responseCardId: string | null
    text: string | null
  }[]
  votes: {
    voterId: string
    votedForPlayerId: string
  }[]
  timerEndsAt: number | null
  roundNumber: number
}

export interface Card {
  id: string
  deckId: string
  type: CardType
  text: string
  metadata?: {
    category?: string | null // for trivia/categories, later
    ruleAction?: string | null // for kings cup, later
    pairsWithType: CardType | null // for CAH prompt-style linking, later
  }
}

export interface Deck {
  id: string
  title: string
  description: string
  compatibleGameIds: string[]
  tier: string
  ownerId: string | null
  isPublic: boolean
  contentRating: 'mild' | 'nsfw'
  cardCount: number
  createdAt: number
}

export const LOCAL_MODE_ENABLED = false