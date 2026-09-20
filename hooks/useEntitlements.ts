import { User } from "@/types/index";
import { firestore, auth, ensureAuth } from "@/firebaseCofig";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { GAME_CONFIGS } from "@/utils";
import { signInAnonymously } from "@react-native-firebase/auth";



export function useEntitlements() {
  const [ownedGameIds, setOwnedGameIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let unsubscribe: (() => void) | undefined

    async function init() {
      const uid = await ensureAuth()

      const userRef = doc(firestore, 'users', uid)

      const snap = await getDoc(userRef)
      if (!snap.exists()){
        const newUser: User = {uid, ownedGameIds: [], createdAt: Date.now()} 
        setDoc(userRef, newUser)
      }

      unsubscribe = onSnapshot(
       userRef,
       docSnap => {
         setOwnedGameIds(docSnap.exists() ? (docSnap.data() as User).ownedGameIds : [])
         setLoading(false)
       },
       error => {
         console.error('useEntitlements subscription error: ', error)
         setLoading(false)
       }
     )
    }

    init()


    

    return () => unsubscribe?.()
  },[])

  function isOwned(gameId: string) {
    const config = GAME_CONFIGS[gameId]
    if (config?.pricing?.isFree) return true // free modes are always owned
    return ownedGameIds.includes(gameId)
  }

  return {ownedGameIds, loading, isOwned}
}