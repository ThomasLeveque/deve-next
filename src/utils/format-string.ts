export function getDomain(url: string): string {
  return url.replace(/^https?:\/\//i, '').split('/')[0];
}

export const getInitials = (text: string): string => {
  const splitedText = text.split(' ');
  if (splitedText.length === 1) {
    const result = splitedText[0];
    return `${result[0]}${result[1]}`;
  } else {
    const firstResult = splitedText[0];
    const lastResult = splitedText[1];
    return `${firstResult[0]}${lastResult[0]}`;
  }
};
