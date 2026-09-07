import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Mongo DB Profile
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const fetchProfile = async (idToken) => {
    try {
      const res = await fetch('http://localhost:3000/api/details/profile', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserProfile(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
        await fetchProfile(idToken);
      } else {
        setToken(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const response = await fetch('http://localhost:3000/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, username: result.user.displayName })
      });

      if (!response.ok) throw new Error('Failed to sync with backend');

      await fetchProfile(idToken);
      return result.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      
      const response = await fetch('http://localhost:3000/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, username: result.user.email.split('@')[0] })
      });

      if (!response.ok) throw new Error('Failed to sync with backend');
      await fetchProfile(idToken);
      return result.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const signupWithEmail = async (email, password) => {
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      
      const response = await fetch('http://localhost:3000/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, username: result.user.email.split('@')[0] })
      });

      if (!response.ok) throw new Error('Failed to sync with backend');
      await fetchProfile(idToken);
      return result.user;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userProfile,
    token,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
