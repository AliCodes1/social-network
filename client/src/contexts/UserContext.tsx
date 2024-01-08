/* eslint-disable */
// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode } from "react";
import { IFollow } from "@/api/userServices";
interface User {
    _id: string;
    username: string;
    profilePicture: string;
    profileDescription?: string;
    followed?: Array<IFollow>; 
    following?: Array<IFollow>; 
  
}
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
  
export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
