import { GameModule } from './GameModule';
import { mostLikelyToModule } from './modules/mostLikelyTo';
import { neverHaveIEverModule } from './modules/neverHaveIEver';
import { truthOrDrinkModule } from './modules/truthOrDrink';

const registry: Record<string, GameModule> = {
  'never-have-i-ever': neverHaveIEverModule,
  'most-likely-to': mostLikelyToModule,
  'truth-or-drink': truthOrDrinkModule,
} 

export function getGameModule(gameId: string): GameModule {
  const mod = registry[gameId]
  if (!mod) throw new Error(`No game module registered for "${gameId}"`)
  return mod
}