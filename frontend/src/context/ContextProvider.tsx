'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from '@/Graphql/queries/userQueries';
import Loader from "@/components/Loader";
import { GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables } from '@/gql/graphql';
import Cookies from 'js-cookie';

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
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      Cookies.set('token', token, { expires: 1 });
    } else {
      localStorage.removeItem('token');
      Cookies.remove('token');
    }
  }, [token]);

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

  if (error) {
    console.error("Error fetching authenticated user:", error);
  }

  return (
    <myContext.Provider value={{ token, setToken, user, setUser }}>
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
