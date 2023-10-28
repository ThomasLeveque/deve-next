export const getDomain = (url: string): string => {
  return url.replace(/^https?:\/\//i, '').split('/')[0] ?? '';
};

export const getInitials = (text: string): string => {
  const splitedText = text.split(' ');
  if (splitedText.length === 1) {
    const result = splitedText[0];
    return result ? `${result[0]}${result[1]}` : '';
  } else {
    const firstResult = splitedText[0];
    const lastResult = splitedText[1];
    return firstResult && lastResult ? `${firstResult[0]}${lastResult[0]}` : '';
  }
};

export const formatError = (err: Error): string => err.message ?? err.toString();

export function stringToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaaaeeeeiiiioooouuuunc------';

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, ''); // trim - from end of text

  return str;
}
