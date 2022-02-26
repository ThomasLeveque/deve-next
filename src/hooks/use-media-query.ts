import { useEffect, useMemo, useState } from 'react';

type screenType = 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const useMediaQuery = (screen: screenType): boolean => {
  const [matches, setMatches] = useState(false);

  const query = useMemo(() => {
    switch (screen) {
      case 'mobile':
        return '(max-width: 639px)';
      case 'sm':
        return '(min-width: 640px)';
      case 'md':
        return '(min-width: 768px)';
      case 'lg':
        return '(min-width: 1024px)';
      case 'xl':
        return '(min-width: 1280px)';
      case '2xl':
        return '(min-width: 1536px)';
    }
  }, [screen]);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};
