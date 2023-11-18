'use client';

import { Button } from '@/components/ui/button';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { useState } from 'react';

type ComboboxProps<TValue extends string | number> = {
  values: TValue[];
  onChange: (newValues: TValue[]) => void;
  options: { value: TValue; label: string }[];
  placeholder?: string;
  children: {
    trigger: React.ReactNode;
    empty: ((search: string) => React.ReactNode) | React.ReactNode;
    itemAction: ((itemValue: TValue) => React.ReactNode) | React.ReactNode;
  };
};

export function Combobox<TValue extends string | number>({
  values,
  onChange,
  options,
  children,
  placeholder,
}: ComboboxProps<TValue>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground"
        >
          {children.trigger}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="start">
        <Command
          filter={(value, search) => {
            const labelFromValue = options
              ?.find((option) => option.value === parseValue(value))
              ?.label?.toLowerCase()
              .trim();

            if (labelFromValue?.includes(search.toLowerCase().trim())) return 1;
            return 0;
          }}
        >
          <CommandInput value={search} onValueChange={setSearch} placeholder={placeholder ?? 'Search...'} />
          <CommandEmpty>
            {(search) => (typeof children.empty === 'function' ? children.empty(search) : children.empty)}
          </CommandEmpty>
          <CommandGroup>
            {options?.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value.toString()}
                onSelect={(currentValue) => {
                  const newValues = parseComboboxValues(currentValue, values);
                  onChange(newValues);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    values.includes(parseValue(option.value)) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option.label}
                {typeof children.itemAction === 'function' ? children.itemAction(option.value) : children.itemAction}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function parseComboboxValues<TValue extends string | number>(value: string | number, values: TValue[]) {
  const parsedCurrentValue = parseValue<TValue>(value);

  return values.includes(parsedCurrentValue)
    ? values.filter((value) => value !== parsedCurrentValue)
    : [...values, parsedCurrentValue];
}

export function parseValue<TValue extends string | number>(value: string | number) {
  const stringValue = value.toString();
  return (isNaN(Number(stringValue)) ? stringValue : Number(stringValue)) as TValue;
}
