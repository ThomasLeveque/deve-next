export const getDomain = (url: string): string => {
  return url.replace(/^https?:\/\//i, '').split('/')[0];
};

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

export const isValidUrl = (url: string): boolean =>
  url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  ) !== null;

export const formatError = (err: Error): string => err.message ?? err.toString();
