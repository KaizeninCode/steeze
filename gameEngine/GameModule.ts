import { GameConfig, Card, Player, RoundState } from './../types/index';

export interface GameModule {
  config: GameConfig
  nextCard(deckCards: Card[], round: RoundState): RoundState
  handleAction(round: RoundState, playerId: string, payload: unknown): RoundState
  applyScoring(players: Player[], round: RoundState): Player[]
  isRoundOver(round: RoundState, deckCards: Card[]): boolean
}
