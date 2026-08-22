import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'


const Home = () => {
  const router = useRouter()
  return (
    <SafeAreaView className='flex-1'>
      <Text className='text-center text-3xl font-bold'>Home</Text>
      <Button onPress={()=>router.navigate('/create-join')} title='Start'/>
    </SafeAreaView>
  )
}

export default Home