import { BellIcon, ShieldCheckIcon, XCircleIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import toast, { ToastBar } from 'react-hot-toast';
import { Toast as ToastType } from 'react-hot-toast/dist/core/types';

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = (props) => {
  const themeClasses: string = useMemo(() => {
    switch (props.toast.type) {
      case 'error':
        return 'bg-danger-400 text-white';
      case 'success':
        return 'bg-success-400 text-white';
      default:
        return 'bg-secondary text-white';
    }
  }, [props.toast.type]);

  const title = useMemo(() => {
    switch (props.toast.type) {
      case 'error':
        return 'An error occurred';
      case 'success':
        return 'This is a success !';
      default:
        // Use className to customize the title
        return props.toast.className;
    }
  }, [props.toast.type]);

  const icon = useMemo(() => {
    switch (props.toast.type) {
      case 'error':
        return <XCircleIcon />;
      case 'success':
        return <ShieldCheckIcon />;
      default:
        return props.toast.icon;
    }
  }, [props.toast.type]);

  return (
    <ToastBar
      toast={props.toast}
      style={{ padding: 0, backgroundColor: 'transparent', zIndex: 100 }}
    >
      {() => (
        <div
          className={classNames(
            'max-w-xs w-full bg-white py-4 px-5 rounded-button shadow-lg relative grid gap-2 grid-cols-[28px,1fr]',
            themeClasses
          )}
        >
          {icon ?? <BellIcon />}
          <div className="grid gap-[6px] mr-4">
            <p className="text-[11px] font-poppins-bold">{title ?? 'Notification'}</p>
            <p className="text-sm">{props.toast.message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(props.toast.id)}
            className="absolute top-2 right-2 hover:bg-white/20 rounded-[4px]"
          >
            <XIcon className="w-[18px]" />
          </button>
        </div>
      )}
    </ToastBar>
  );
};

export default Toast;
