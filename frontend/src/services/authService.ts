import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, signOut, sendPasswordResetEmail,
  updateProfile, onAuthStateChanged, type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'
import type { User, UserRole } from '@/types'

export async function registerWithEmail(
  name: string, email: string, password: string,
  role: UserRole = 'resident', communityId = '',
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })
  const userDoc = {
    id: credential.user.uid, name, email, role, communityId, communityName: '',
    trustScore: 50, interests: [], isVerified: false,
    createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
  }
  await setDoc(doc(db, 'users', credential.user.uid), userDoc)
  return { ...userDoc, badges: [], createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() }
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const profile = await getUserProfile(credential.user.uid)
  if (!profile) throw new Error('User profile not found. Please contact support.')
  return profile
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider)
  const userRef = doc(db, 'users', credential.user.uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, {
      id: credential.user.uid, name: credential.user.displayName ?? 'Unknown',
      email: credential.user.email, avatar: credential.user.photoURL,
      role: 'resident' as UserRole, communityId: '', communityName: '',
      trustScore: 50, interests: [], badges: [], isVerified: false,
      createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
    })
  }
  return credential
}

export async function logout() { return signOut(auth) }

export async function resetPassword(email: string) { return sendPasswordResetEmail(auth, email) }

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return snap.data() as User
}

export function observeAuthState(callback: (u: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}
