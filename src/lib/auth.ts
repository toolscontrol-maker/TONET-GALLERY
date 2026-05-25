/**
 * Auth service — Firebase Auth + Firestore
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc,
  collection, query, where, getDocs, limit,
} from 'firebase/firestore';
import { auth, db } from './firebase';

// ── Types ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phonePrefix?: string;
  birthDate?: string;
  newsletter: boolean;
  onboardingComplete: boolean;
  provider: 'email' | 'google';
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  isNew?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────

export async function getUserById(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as User) : null;
}

// ── Public API ─────────────────────────────────────────────────────

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AuthResult> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await fbUpdateProfile(cred.user, { displayName: `${firstName.trim()} ${lastName.trim()}` });

    const user: User = {
      id: cred.user.uid,
      email: email.toLowerCase().trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      newsletter: false,
      onboardingComplete: false,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), user);
    return { success: true, user, isNew: true };
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: err.message ?? 'Registration failed.' };
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = await getUserById(cred.user.uid);
    if (!user) return { success: false, error: 'User profile not found.' };
    return { success: true, user };
  } catch (err: any) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential'
    ) {
      return { success: false, error: 'Incorrect email or password.' };
    }
    return { success: false, error: err.message ?? 'Login failed.' };
  }
}

const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<AuthResult> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const existing = await getUserById(cred.user.uid);

    if (existing) {
      return { success: true, user: existing };
    }

    const parts = (cred.user.displayName ?? '').split(' ');
    const user: User = {
      id: cred.user.uid,
      email: cred.user.email!,
      firstName: parts[0] ?? '',
      lastName: parts.slice(1).join(' ') ?? '',
      newsletter: false,
      onboardingComplete: false,
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), user);
    return { success: true, user, isNew: true };
  } catch (err: any) {
    console.error('[loginWithGoogle] error:', err.code, err.message);
    if (
      err.code === 'auth/popup-closed-by-user' ||
      err.code === 'auth/cancelled-popup-request'
    ) {
      return { success: false, error: 'Sign-in cancelled.' };
    }
    return { success: false, error: err.message ?? 'Google sign-in failed.' };
  }
}

export async function updateProfile(
  updates: Partial<Omit<User, 'id' | 'email' | 'provider' | 'createdAt'>>,
): Promise<User | null> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  const ref = doc(db, 'users', firebaseUser.uid);
  await updateDoc(ref, updates as Record<string, unknown>);
  return getUserById(firebaseUser.uid);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function emailExists(email: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'users'),
      where('email', '==', email.toLowerCase().trim()),
      limit(1),
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch {
    return false;
  }
}
