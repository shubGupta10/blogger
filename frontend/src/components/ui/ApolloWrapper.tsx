'use client';

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { ReactNode } from 'react';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: 'include',
});

interface ApolloWrapperProps {
  children: ReactNode;
}

const ApolloWrapper = ({ children }: ApolloWrapperProps) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;