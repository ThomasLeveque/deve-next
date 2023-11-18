'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQueryString } from '@/hooks/use-query-string';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/utils/cn';
import { Search, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  inputClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, inputClassName, ...props }, ref) => {
    const form = useForm();
    const { searchQuery, setSearchQuery } = useQueryString();
    const [query, setQuery] = useState<string | null>(searchQuery);

    const debouncedQuery = useDebounce<string | null>(query, 300);

    useEffect(() => {
      if (debouncedQuery === '') {
        setSearchQuery(null);
        return;
      }

      if (debouncedQuery !== searchQuery) {
        setSearchQuery(debouncedQuery);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

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
                <Input
                  type="search"
                  className={cn('px-10', inputClassName)}
                  ref={ref}
                  {...props}
                  value={query ?? ''}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </FormControl>
              {query && (
                <button className="absolute right-3" onClick={() => setQuery(null)}>
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
