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
        'relative flex items-center px-1 h-[30px] w-[50px] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none with-ring',
        props.checked ? 'bg-success-400 justify-end' : 'bg-danger-400 justify-start',
        { 'opacity-50': disabled },
        props.className
      )}
    >
      {props.screenReaderText !== undefined && (
        <span className="sr-only">{props.screenReaderText}</span>
      )}
      <span
        aria-hidden="true"
        className={classNames(
          'pointer-events-none h-[22px] w-[22px] rounded-full bg-white shadow-lg ring-0 ease-in-out duration-200'
        )}
      />
    </Switch>
  );
};

export default ToggleSwitch;
