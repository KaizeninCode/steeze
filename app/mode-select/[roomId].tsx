import { View, Text, Button, FlatList, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { doc, updateDoc } from '@react-native-firebase/firestore'
import { firestore } from '@/firebaseCofig'
import { useRoom } from '@/hooks/useRoom'
import { useLocalRoomStore } from '@/state/localRoom'
import { GAME_CONFIGS, V1_GAME_IDS } from '@/utils'


const ModeSelect = () => {
  const router = useRouter()
  const {roomId} = useLocalSearchParams<{roomId: string}>()
  const isLocal = roomId.startsWith('local-')

  // ----- explicit branch, same convention as Lobby -----
  const onlineRoomData = useRoom(isLocal ? null : roomId)
  const localRoom = useLocalRoomStore(state => state.room)
  const setLocalActiveGame = useLocalRoomStore(state => state.setActiveGame)

  const room = isLocal ? localRoom : onlineRoomData.room
  const modes = V1_GAME_IDS.map(id => GAME_CONFIGS[id])

  if (!room) return <Text>Loading room...</Text>

  async function handleSelectMode(gameId: string) {
    if (isLocal) {
      setLocalActiveGame(gameId)
    } else {
      await updateDoc(doc(firestore, 'rooms', roomId), {'settings.activeGameId': gameId})
    }
    router.push({pathname: '/gameplay/[roomId]', params: {roomId}})
  }
  return (
    <SafeAreaView className='flex-1 p-5 gap-16'>
      <Text className='text-center text-2xl font-semibold'>Choose a game</Text>
      <FlatList 
        data={modes}
        keyExtractor={m => m.id}
        renderItem={({item}) => (
          <Pressable className='p-5 rounded-xl bg-[#f1efe8] mb-3' onPress={()=> handleSelectMode(item.id)}>
            <Text className='font-medium'>{item.displayName}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}

export default ModeSelect