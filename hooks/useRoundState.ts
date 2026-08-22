import { RoundState } from './../types/index';
import { firestore } from "@/firebaseCofig";
import { doc, onSnapshot, setDoc, deleteDoc } from "@react-native-firebase/firestore";
import { useEffect,useState } from "react";

export function useRoundState(roomId: string | null){
  const [roundState, setRoundState] = useState<RoundState | null>(null)

  useEffect(()=>{
    if (!roomId) {
      setRoundState(null)
      return
    }
    const unsubscribe = onSnapshot(
      doc(firestore, 'rooms', roomId, 'state', 'current'),
      snap => setRoundState(snap.exists() ? (snap.data() as RoundState): null),
      error => console.error('useRoundState subscription error:', error),
    )
    return () => unsubscribe()
  }, [roomId])

  async function updateRoundState(next: RoundState){
    if (!roomId) return
    await setDoc(doc(firestore, 'rooms', roomId, 'state', 'current'), next)
  }

  async function deleteRoundState(){
    if (!roomId) return
    await deleteDoc(doc(firestore, 'rooms', roomId, 'state', 'current'))
  }

  return {roundState, updateRoundState, deleteRoundState}
}
