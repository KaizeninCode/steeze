import { Player, Room, RoundState } from "@/types";
import { create } from "zustand";

interface LocalRoomState {
  room: Room | null;
  roundState: RoundState | null
  createRoom: (
    roomId: string,
    hostGuestId: string,
    hostDisplayName: string,
  ) => void;
  addPlayer: (player: Player) => void;
  renamePlayer: (playerId: string, updatedName: string) => void;
  updatePlayers: (players:Player[]) => void
  setActiveGame: (gameId:string) => void;
  setRoundState: (state: RoundState) => void
  reset: () => void;
}

export const useLocalRoomStore = create<LocalRoomState>((set) => ({
  room: null,
  roundState: null,
  setRoundState: (state: RoundState) => set({roundState:state}),
  setActiveGame: (gameId) => set(state => {
    if (!state.room) return state
    return {room: {...state.room, settings:{...state.room.settings, activeGameId: gameId}}}
  }),
  updatePlayers: (players: Player[]) => set(state => {
    if (!state.room) return state
    return {room:{...state.room, players}}
  }),
  createRoom: (roomId, hostGuestId, hostDisplayName) => {
    const hostPlayer: Player = {
      playerId: hostGuestId,
      displayName: hostDisplayName,
      score: 0,
      isHost: true,
      connected: true
    }
    set({
      room: {
        id: roomId,
        hostId: hostGuestId,
        status: 'lobby',
        createdAt: Date.now(),
        settings: {
          mode: 'local',
          activeGameId: null,
          deckIds: [],
          playerOrder: [hostGuestId],
          currentTurnIndex: 0
        },
        players: [hostPlayer]
      }
    })
  },
  addPlayer: (player) => set(state => {
    if (!state.room) return state
    return {
      room: {
        ...state.room,
        players: [...state.room.players, player],
        settings: {
          ...state.room.settings,
          playerOrder: [...state.room.settings.playerOrder, player.playerId]
        }
      }
    }
  }),
  renamePlayer: (playerId:string, updatedName:string) => set(state => {
    if (!state.room) return state
    return {
      room: {
        ...state.room,
        players: state.room.players.map(existingPlayer =>
          existingPlayer.playerId === playerId 
            ? { ...existingPlayer, displayName: updatedName }
            : existingPlayer
        ),
      }
    }
  }),
  reset: () => set({room: null}),
}));
