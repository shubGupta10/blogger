'use client';

import { useEffect, useCallback } from 'react';
import { useApolloClient, gql } from '@apollo/client';

const HEALTH_CHECK_QUERY = gql`
  query {
    __typename
  }
`;

const ReloadComponent = ({ interval = 60000 }) => {
  const client = useApolloClient();

  const reloadWebsite = useCallback(() => {
    client
      .query({ query: HEALTH_CHECK_QUERY, fetchPolicy: 'network-only' })
      .then((response) => {
        console.log(`Reloaded at ${new Date().toISOString()}:`, response.data);
      })
      .catch((error) => {
        console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
      });
  }, [client]);

  useEffect(() => {
    const intervalId = setInterval(reloadWebsite, interval);

    // Initial load
    reloadWebsite();

    return () => {
      clearInterval(intervalId);
    };
  }, [reloadWebsite, interval]);

  return null;
};

export default ReloadComponent;