'use client'; 

import { useEffect } from 'react';
import axios from 'axios';

const ReloadComponent = ({ url, interval = 30000 }) => {
  const reloadWebsite = () => {
    axios.get(url)
      .then(response => {
        console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
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
  }, [url]);

  return null; 
};

export default ReloadComponent;
