'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, XCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputClassName?: string;
  clearValue?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, inputClassName, clearValue, ...props }, ref) => {
    const form = useForm();
    return (
      <Form {...form}>
        <FormField
          name=""
          render={() => (
            <FormItem className={cn('relative flex items-center space-y-0', className)}>
              <FormLabel className="absolute left-3">
                <Search size={18} className="opacity-50" />
              </FormLabel>
              <FormControl>
                <Input type="search" className={cn('px-10', inputClassName)} ref={ref} {...props} />
              </FormControl>
              {props.value && (
                <button className="absolute right-3" onClick={clearValue}>
                  <XCircle size={18} />
                </button>
              )}
            </FormItem>
          )}
        />
      </Form>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
