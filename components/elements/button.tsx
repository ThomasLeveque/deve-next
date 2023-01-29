import SpinnerIcon from '@components/icons/spinner-icon';
import { cn } from '@utils/cn';
import React, { useMemo } from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  text?: string;
  type?: 'button' | 'submit';
  icon?: JSX.Element;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  theme?: 'primary' | 'secondary' | 'black' | 'gray' | 'danger' | 'discord' | 'google' | 'github';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const iconPosition = props.iconPosition ?? 'right';
  const fullWidth = props.fullWidth ?? false;
  const type = props.type ?? 'button';
  const theme = props.theme ?? 'primary';

  const isTextAndIcon = props.icon !== undefined && props.text !== undefined;
  const isOnlyText = props.icon === undefined && props.text !== undefined;
  const isOnlyIcon = props.icon !== undefined && props.text === undefined;

  const themeClasses: string = useMemo(() => {
    switch (theme) {
      case 'primary':
        return 'bg-primary text-black';
      case 'secondary':
        return 'bg-secondary text-white';
      case 'black':
        return 'bg-black text-white';
      case 'gray':
        return 'bg-gray-100 text-black';
      case 'danger':
        return 'bg-danger-400 text-white';
      case 'discord':
        return 'bg-discord text-white';
      case 'google':
        return 'bg-google text-white';
      case 'github':
        return 'bg-github text-white';
    }
  }, [theme]);

  return (
    <button
      ref={ref}
      className={cn(
        'with-ring flex h-[46px] items-center justify-center rounded-button text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-40',
        { 'w-full': fullWidth },
        { 'px-5': !isOnlyIcon },
        { 'w-[46px]': isOnlyIcon },
        themeClasses,
        props.className
      )}
      type={type}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <span className="w-[16px]">
          <SpinnerIcon />
        </span>
      ) : (
        <>
          {isTextAndIcon ? (
            <div
              className={cn(
                'grid items-center gap-3',
                iconPosition === 'left' ? 'grid-cols-[20px,1fr]' : 'grid-cols-[1fr,20px]'
              )}
            >
              {props.text}
              <span className={iconPosition === 'left' ? 'order-first' : 'order-last'}>{props.icon}</span>
            </div>
          ) : null}
          {isOnlyText ? props.text : null}
          {isOnlyIcon ? <span className="w-[20px]">{props.icon}</span> : null}
        </>
      )}
    </button>
  );
});

export default Button;
