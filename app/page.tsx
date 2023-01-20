import RootClient from 'app/pageClient';

export default async function Root() {
  // Pass initialLinks to RootClient when mutate server data will be possible
  return <RootClient />;
}
