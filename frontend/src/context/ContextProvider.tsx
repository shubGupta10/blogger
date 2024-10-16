'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from '@/Graphql/queries/userQueries';
import Loader from "@/components/Loader";
import { GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables } from '@/gql/graphql';

interface ContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: any; 
  setUser: (user: any) => void;
}

const myContext = createContext<ContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
});

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const { data, loading, error } = useQuery<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>(
    GET_AUTHENTICATED_USER
  );

  useEffect(() => {
    if (data) {
      setUser(data.authenticatedUser); 
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }



  return (
    <myContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </myContext.Provider>
  );
};

// Custom hook to use the context
export const useMyContext = () => {
  const context = useContext(myContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
