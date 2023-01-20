import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  screenReaderText?: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = (props) => {
  const disabled = props.disabled ?? false;
  const onChange = props.onChange ?? (() => null);
  return (
    <Switch
      disabled={disabled}
      checked={props.checked}
      onChange={onChange}
      className={classNames(
        'with-ring relative flex h-[30px] w-[50px] cursor-pointer items-center rounded-full px-1 transition-colors duration-200 ease-in-out focus:outline-none',
        props.checked ? 'justify-end bg-success-400' : 'justify-start bg-danger-400',
        { 'opacity-50': disabled },
        props.className
      )}
    >
      {props.screenReaderText !== undefined && <span className="sr-only">{props.screenReaderText}</span>}
      <span
        aria-hidden="true"
        className={classNames(
          'pointer-events-none h-[22px] w-[22px] rounded-full bg-white shadow-lg ring-0 duration-200 ease-in-out'
        )}
      />
    </Switch>
  );
};

export default ToggleSwitch;
