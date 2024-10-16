'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface ContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const myContext = createContext<ContextType>({
  token: null, 
  setToken: () => {}, 
});

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <myContext.Provider value={{ token, setToken }}>
      {children}
    </myContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(myContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
