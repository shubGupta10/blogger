import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { ReactNode, useMemo } from 'react';

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: 'include',
  });

  const authLink = new ApolloLink((operation, forward) => {
    // Get the authentication token from local storage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      }
    });

    return forward(operation);
  });

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
  });
};

interface ApolloWrapperProps {
  children: ReactNode;
}

export const ApolloWrapper = ({ children }: ApolloWrapperProps) => {
  const client = useMemo(() => createApolloClient(), []);

  if (typeof window === 'undefined') return <>{children}</>;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;