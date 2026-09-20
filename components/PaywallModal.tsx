import { GAME_CONFIGS } from '@/utils'
import { View, Text, Modal, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  gameId: string
  onClose: () => void
}

const PaywallModal = ({gameId, onClose}: Props) => {
  const config = GAME_CONFIGS[gameId]


  return (
    // <SafeAreaView className='flex-1 bg-dark'>
      <Modal transparent animationType='fade'>
        <View className='flex-1 bg-[rgba(0,0,0,0.5)] justify-center items-center'>
          <View className='bg-white rounded-2xl p-6 w-4/5 gap-3'>

          </View>
          <Text className='font-semibold'>{config.displayName}</Text>
          <Text className='text-[#555]'>Unlock for [insert price here]</Text>
          {/* TODO: real purchase button. RevenueCat/expo-in-app-purchases */}
          <Pressable className='py-3 rounded-lg bg-[#fde047] items-center' onPress={onClose}>
            <Text className='text-dark'>Coming Soon!</Text>
          </Pressable>
        </View>
      </Modal>
    // </SafeAreaView>
  )
}

export default PaywallModal