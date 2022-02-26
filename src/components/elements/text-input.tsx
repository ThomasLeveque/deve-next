import { EyeIcon, EyeOffIcon, SearchIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { ChangeEvent, FocusEvent, KeyboardEvent, useCallback, useState } from 'react';

interface TextInputProps {
  id: string;
  label?: string;
  name?: string;
  type?: 'text' | 'password' | 'search';
  placeholder?: string;
  autoComplete?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  clearValue?: () => void;
  goToResetPassword?: () => void;
  value?: string;
  withShowPassword?: boolean;
  withResetPassword?: boolean;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  minLength?: number;
  maxLength?: number;
  errorText?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const type = props.type ?? 'text';
  const withShowPassword = props.withShowPassword ?? true;
  const withResetPassword = props.withResetPassword ?? false;
  const clearValue = props.clearValue ?? (() => null);
  const goToResetPassword = props.goToResetPassword ?? (() => null);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => setShowPassword((prevShowPassword) => !prevShowPassword), []);

  return (
    <div className={classNames('relative flex flex-wrap', props.className)}>
      {props.label !== undefined ? (
        <label
          htmlFor={props.id}
          className={classNames(
            'mb-[6px] ml-1 block font-poppins-bold text-[10px] uppercase text-black',
            props.labelClassName
          )}
        >
          {props.label}
        </label>
      ) : null}
      <div className="relative flex w-full items-center">
        {props.type === 'search' ? (
          <SearchIcon
            className="absolute left-4 w-6 cursor-text"
            onClick={() => {
              (ref as React.MutableRefObject<HTMLInputElement | null>)?.current?.focus();
            }}
          />
        ) : null}
        {props.type === 'search' && props.value?.length ? (
          <XCircleIcon onClick={clearValue} className="absolute right-4 w-6 cursor-pointer" />
        ) : null}
        {withResetPassword ? (
          <a
            href="#"
            className="absolute bottom-full right-0 mb-2 mr-1 font-poppins-bold text-[10px] hover:underline focus:underline"
            onClick={(event) => {
              event.preventDefault();
              goToResetPassword();
            }}
          >
            Forgot password ?
          </a>
        ) : null}
        <input
          ref={ref}
          type={showPassword ? 'text' : type}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          minLength={props.minLength}
          autoComplete={props.autoComplete}
          className={classNames(
            'with-ring h-[50px] w-full rounded-button bg-gray-100 px-5 text-sm placeholder-gray-400',
            { 'pr-12': type === 'password' },
            { 'px-12': type === 'search' },
            props.inputClassName
          )}
          value={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onKeyDown={props.onKeyDown}
        />
        {props.type === 'password' && withShowPassword ? (
          <span className="absolute right-4 w-6 cursor-pointer">
            {showPassword ? <EyeOffIcon onClick={toggleShowPassword} /> : <EyeIcon onClick={toggleShowPassword} />}
          </span>
        ) : null}
      </div>
      {props.errorText ? (
        <p className="absolute top-full right-1 mt-1 text-[10px] text-danger-400">{props.errorText}</p>
      ) : null}
    </div>
  );
});

export default TextInput;
