export const dbKeys = {
  links: 'links',
  link: (linkId: string): string => `links/${linkId}`,
  comments: (linkId: string): string => `links/${linkId}/comments`,
  comment: (linkId: string, commentId: string): string => `links/${linkId}/comments/${commentId}`,
};
