'use client';

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, 
  credentials: 'include', 
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

const ApolloWrapper = ({ children }: any) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;
