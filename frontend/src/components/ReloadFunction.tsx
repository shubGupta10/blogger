'use client';

import { useEffect } from 'react';
import axios from 'axios';

const ReloadComponent = ({ url, interval = 30000 }) => {
  const reloadWebsite = () => {
    axios.post(url, {
      query: `
        query {
          __typename
        }
      `
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log(`Reloaded at ${new Date().toISOString()}:`, response.data);
      })
      .catch(error => {
        console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(reloadWebsite, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [url, interval]);

  return null;
};

export default ReloadComponent;
