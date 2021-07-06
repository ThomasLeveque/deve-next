import classNames from 'classnames';
import React, { useMemo } from 'react';

import SpinnerIcon from '@components/icons/spinner-icon';

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
  theme?: 'primary' | 'secondary' | 'black' | 'gray';
}

const Button: React.FC<ButtonProps> = (props) => {
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
    }
  }, [theme]);

  return (
    <button
      className={classNames(
        'rounded-button disabled:opacity-40 disabled:cursor-not-allowed h-[46px] font-poppins-bold text-xs uppercase flex justify-center items-center with-ring',
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
              className={classNames(
                'grid items-center gap-3',
                iconPosition === 'left' ? 'grid-cols-[20px,1fr]' : 'grid-cols-[1fr,20px]'
              )}
            >
              {props.text}
              <span className={iconPosition === 'left' ? 'order-first' : 'order-last'}>
                {props.icon}
              </span>
            </div>
          ) : null}
          {isOnlyText ? props.text : null}
          {isOnlyIcon ? <span className="w-[20px]">{props.icon}</span> : null}
        </>
      )}
    </button>
  );
};

export default Button;
