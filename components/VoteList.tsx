import { View, Text, Pressable } from 'react-native'
import {Player, RoundState} from '@/types'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  players: Player[]
  roundState: RoundState
  currentPlayerId: string | undefined
  onVote: (votedForPlayerId: string) => void
}

const VoteList = ({players, roundState, currentPlayerId, onVote}: Props) => {
  const myVote = roundState.votes.find(v => v.voterId === currentPlayerId)?.votedForPlayerId
  const tally: Record<string, number> = {}
  roundState.votes.forEach(v => tally[v.votedForPlayerId] = (tally[v.votedForPlayerId] ?? 0) + 1) 

  return (
    <SafeAreaView className='flex-1 p-5 items-start w-full justify-center'>
      {players.map(p => (
        <Pressable className={`flex flex-row justify-between gap-4 p-3 rounded-lg  ${myVote === p.playerId ? 'bg-[#1d1b33] text-white' : 'bg-[#f1efe8]'}`} key={p.playerId} onPress={() => onVote(p.playerId)}>
          <Text className={`${myVote === p.playerId && 'text-white'}`}>{p.displayName}</Text>
          <Text className={`${myVote === p.playerId && 'text-white'}`}>{tally[p.playerId] ?? 0}</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  )
}

export default VoteList