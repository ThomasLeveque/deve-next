export const dbKeys = {
  users: 'users',
  user: (userId: string): string => `users/${userId}`,
};
