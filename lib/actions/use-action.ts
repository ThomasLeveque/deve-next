import { ExplicitAny } from '@/types/shared';
import { useRef, useState, useTransition } from 'react';

export function useAction<Action extends (...args: ExplicitAny[]) => Promise<ExplicitAny>>(
  action: Action,
  callbacks?: {
    onSuccess?: (data: Awaited<ReturnType<Action>>) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  }
) {
  const [, startTransition] = useTransition();
  const executor = useRef<Action>(action);
  const [isExecuting, setIsExecuting] = useState(false);

  const execute = (...args: Parameters<Action>) => {
    setIsExecuting(true);
    startTransition(() => {
      executor
        .current(...args)
        .then((data) => {
          callbacks?.onSuccess?.(data);
        })
        .catch((error) => {
          callbacks?.onError?.(error);
          console.error(error);
        })
        .finally(() => {
          callbacks?.onSettled?.();
          setIsExecuting(false);
        });
    });
  };

  return [isExecuting, execute] as const;
}
