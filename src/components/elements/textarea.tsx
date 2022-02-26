import classNames from 'classnames';
import React, { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

interface TextAreaProps {
  id: string;
  label?: string;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  value?: string;
  labelClassName?: string;
  className?: string;
  textareaClassName?: string;
  minLength?: number;
  maxLength?: number;
  errorText?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
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
        <textarea
          ref={ref}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          minLength={props.minLength}
          autoComplete={props.autoComplete}
          className={classNames(
            'with-ring w-full rounded-button bg-gray-100 px-5 py-4 text-sm placeholder-gray-400',
            props.textareaClassName
          )}
          value={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onKeyDown={props.onKeyDown}
        />
      </div>
      {props.errorText ? (
        <p className="absolute top-full right-1 mt-1 text-[10px] text-danger-400">{props.errorText}</p>
      ) : null}
    </div>
  );
});

export default TextArea;
