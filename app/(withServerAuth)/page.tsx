import RootClient from 'app/(withServerAuth)/pageClient';

export default async function Root() {
  // Pass initialLinks to RootClient when mutate server data will be possible
  return <RootClient />;
}
