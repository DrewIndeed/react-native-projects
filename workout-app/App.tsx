import { StatusBar } from 'expo-status-bar';
import Navigation from './navigation/index';
import useCachedResources from './hooks/useCachedResources';

export default function App() {
  const isLoaded = useCachedResources();
  console.log("At App:", isLoaded);

  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}
