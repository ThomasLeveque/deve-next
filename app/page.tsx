import RootClient from 'app/PageClient';

export default async function Root() {
  // Pass initialLinks to RootClient when mutate server data will be possible
  return <RootClient />;
}
