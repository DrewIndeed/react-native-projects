import { useState, useEffect } from 'react';

const useCachedResources = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    console.log('Execute useEffect');
    function loadResourcesAndDataAsunc() {
      setTimeout(() => {
        console.log('Set isLoading to true ');
        setIsLoadingComplete(true);
      }, 3000);
    }

    loadResourcesAndDataAsunc();
  }, []);

  console.log('Returning:', isLoadingComplete);
  return isLoadingComplete;
};

export default useCachedResources;
