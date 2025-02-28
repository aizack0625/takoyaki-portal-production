'use client';

import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import { app } from '../firebase/config';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  // Googleログイン機能
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // ゲストログイン機能
  const guestLogin = async () => {
    return signInAnonymously(auth);
  }

  // ユーザーネーム変更
  const updateUsername = async (newUsername) => {
    try {
      if (!user) throw new Error('ユーザーが存在しません');

      await updateProfile(user, {
        displayName: newUsername
      });

      // ユーザー情報を更新して再レンダリングを促す
      setUser({...user, displayName: newUsername });

      return true;
    } catch (error) {
      console.error('ユーザー名の更新に失敗しました:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    googleLogin,
    guestLogin,
    updateUsername,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
