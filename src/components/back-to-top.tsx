import { ArrowSmUpIcon } from '@heroicons/react/outline';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Button from './elements/button';

const BackToTop: React.FC = () => {
  const { ref, entry } = useInView();

  const handleScrollTop = (): void => {
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="absolute inset-0 h-screen w-[1px]" ref={ref}>
      {entry && !entry.isIntersecting && (
        <Button
          className="fixed bottom-2 right-2"
          onClick={handleScrollTop}
          theme="secondary"
          icon={<ArrowSmUpIcon />}
        />
      )}
    </div>
  );
};

export default BackToTop;
