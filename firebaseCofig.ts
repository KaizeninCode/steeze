import {getApp} from '@react-native-firebase/app'
import {getAuth, signInAnonymously} from '@react-native-firebase/auth'
import {getFirestore} from '@react-native-firebase/firestore'

const app = getApp()

export const auth = getAuth(app)
export const firestore = getFirestore(app)

// ensures a signed in user exists, signing in anonymously if not
// called at the top of any action that needs a hostId/playerId
export async function ensureAuth():Promise<string> {
  if (auth.currentUser) return auth.currentUser.uid
  const credential = await signInAnonymously(auth)
  return credential.user.uid
}



