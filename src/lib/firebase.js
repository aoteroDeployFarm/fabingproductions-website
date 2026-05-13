import { getApps, getApp, initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app       = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const db        = getFirestore(app)
export const functions = getFunctions(app)

// auth and storage are lazy so a missing/empty API key during local dev
// doesn't crash the app at module load time. Import the getter directly
// in any component that needs them: import { getAuth } from 'firebase/auth'
export const auth    = (() => { try { return getAuth(app) }    catch { return null } })()
export const storage = (() => { try { return getStorage(app) } catch { return null } })()

if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080, { merge: true })
  connectFunctionsEmulator(functions, 'localhost', 5001)
}
