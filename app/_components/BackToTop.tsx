'use client';

import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const BackToTop: React.FC = () => {
  const { ref, entry } = useInView();

  const handleScrollTop = (): void => {
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="absolute inset-0 h-screen w-[1px]" ref={ref}>
      {entry && !entry.isIntersecting && (
        <Button className="fixed bottom-2 right-2" onClick={handleScrollTop} size="icon">
          <ArrowUp size={18} />
        </Button>
      )}
    </div>
  );
};

export default BackToTop;
