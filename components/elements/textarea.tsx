import classNames from 'classnames';
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  errorText?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, labelClassName, wrapperClassName, errorText, className, ...textAreaProps }, ref) => {
    return (
      <div className={classNames('relative flex flex-wrap', wrapperClassName)}>
        {label && (
          <label
            htmlFor={textAreaProps.id}
            className={classNames(
              'mb-[6px] ml-1 block font-poppins-bold text-[10px] uppercase text-black',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex w-full items-center">
          <textarea
            ref={ref}
            className={classNames(
              'with-ring w-full rounded-button bg-gray-100 px-5 py-4 text-sm placeholder-gray-400',
              className
            )}
            {...textAreaProps}
          />
        </div>
        {errorText ? <p className="absolute top-full right-1 mt-1 text-[10px] text-danger-400">{errorText}</p> : null}
      </div>
    );
  }
);

export default TextArea;
