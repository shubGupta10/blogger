import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { ReactNode, useMemo } from 'react';
import dynamic from 'next/dynamic';

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: 'include',
  });

  const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token');
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
  });
};

interface ApolloWrapperProps {
  children: ReactNode;
}

const ApolloWrapperComponent = ({ children }: ApolloWrapperProps) => {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export const ApolloWrapper = dynamic(() => Promise.resolve(ApolloWrapperComponent), {
  ssr: false,
}) as React.ComponentType<ApolloWrapperProps>;

export default ApolloWrapper;