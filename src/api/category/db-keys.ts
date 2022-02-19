export const dbKeys = {
  categories: 'categories',
  category: (categoryId: string): string => `categories/${categoryId}`,
};
