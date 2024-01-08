/* eslint-disable */
// @ts-nocheck
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getUserSession } from '../api/userServices';
import { useUser } from './UserContext'; // Import the useUser hook

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useUser(); // Use the setUser function from UserContext

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    setUser(null); // Reset user to null on logout
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await getUserSession();
        if (response.status === 200 && response.data.isLoggedIn) {
          login();
          setUser(response.data.user); // Set the user data on successful login
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser]); // Add setUser as a dependency

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};