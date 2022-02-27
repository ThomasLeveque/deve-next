export const dbKeys = {
  links: 'links',
  selectLinks: `
    *,
    user:profiles!links_userId_fkey(*),
    tags!inner(*),
    comments(*),
    votes(*)
  `,
};
