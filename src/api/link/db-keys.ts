export const dbKeys = {
  links: 'links',
  linksTags: 'links_tags',
  votes: 'votes',
  selectLinks: `
    *,
    user:profiles!links_userId_fkey(*),
    tags!inner(*),
    comments(*),
    votes(*)
  `,
};
