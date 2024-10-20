import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ReactNode } from 'react';

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    let token;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }
    // Return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

interface ApolloWrapperProps {
    children: ReactNode;
}

const ApolloWrapper = ({ children }: ApolloWrapperProps) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;