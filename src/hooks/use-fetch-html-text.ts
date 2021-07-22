import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { isValidUrl } from '@utils/format-string';

import { formatError } from './../utils/format-string';

interface useFetchHtmlTextReturn {
  htmlText: string | null;
  loading: boolean;
}

export const useFetchHtmlText = (url: string, htmlSelector = 'h1'): useFetchHtmlTextReturn => {
  const [htmlText, setHtmlText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const asyncFetchHtmlText = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const htmlElement = doc.querySelector(htmlSelector);
          const htmlElementText = htmlElement?.innerHTML?.trim();

          if (htmlElement && htmlElementText) {
            setHtmlText(htmlElementText);
          }
        }
      } catch (err) {
        toast.error(formatError(err));
        console.error(err);
      }
      setLoading(false);
    };
    if (isValidUrl(url)) {
      asyncFetchHtmlText();
    }
  }, [url]);

  return {
    htmlText,
    loading,
  };
};
