import classNames from 'classnames';
import React from 'react';

import SpinnerIcon from '@components/icons/spinner-icon';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  text?: string;
  icon?: JSX.Element;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  const iconPosition = props.iconPosition ?? 'right';
  const fullWidth = props.fullWidth ?? false;

  return (
    <button
      className={classNames(
        'rounded-button bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 h-[46px] font-poppins-bold text-xs uppercase flex justify-center items-center with-ring',
        { 'w-full': fullWidth },
        props.className
      )}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <span className="w-[20px]">
          <SpinnerIcon />
        </span>
      ) : (
        <>
          {props.icon !== undefined && props.text !== undefined ? (
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
          {props.icon === undefined && props.text !== undefined ? props.text : null}
          {props.icon !== undefined && props.text === undefined ? (
            <span className="w-[20px]">{props.icon}</span>
          ) : null}
        </>
      )}
    </button>
  );
};

export default Button;
