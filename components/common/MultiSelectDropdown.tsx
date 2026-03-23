'use client';

import { classNames } from '@/utils/utils';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useRef, useState, useEffect } from 'react';

export interface MultiSelectDropdownProps {
  label: string;
  placeholder?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  helperText?: string;
  /** Optional max height for the dropdown list (default: 200px) */
  maxListHeight?: string;
}

export default function MultiSelectDropdown({
  label,
  placeholder = 'Search',
  options,
  value,
  onChange,
  helperText,
  maxListHeight = '200px',
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option].sort());
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const displayText =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0]
        : `${value.length} selected`;

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium text-primary-dark font-inter mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={classNames(
          'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-sm font-inter min-h-[40px]',
          value.length > 0
            ? 'border-primary-blue text-primary-blue bg-primary-blue/5'
            : 'border-customGray-10 text-primary-dark bg-white focus:border-primary-blue/50',
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <span className={classNames('truncate', value.length > 0 ? 'text-primary-blue' : '')}>
          {displayText}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {value.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              className="p-0.5 rounded text-customGray-90 hover:bg-customGray-10 hover:text-primary-dark"
              aria-label="Clear selection"
            >
              <XMarkIcon className="h-4 w-4" />
            </span>
          )}
          <ChevronDownIcon
            className={classNames('h-4 w-4 text-customGray-90 transition-transform', isOpen ? 'rotate-180' : '')}
            aria-hidden
          />
        </div>
      </button>
      {helperText && (
        <p className="text-xs text-customGray-50 mt-1 font-inter">{helperText}</p>
      )}
      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full rounded-lg border border-customGray-10 bg-white shadow-lg overflow-hidden"
          role="listbox"
          style={{ maxHeight: maxListHeight }}
        >
          <div className="overflow-y-auto py-1" style={{ maxHeight: maxListHeight }}>
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-customGray-50 font-inter">
                No options
              </div>
            ) : (
              options.map(option => {
                const selected = value.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggleOption(option)}
                    className={classNames(
                      'w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-inter transition-colors',
                      selected
                        ? 'bg-primary-blue/10 text-primary-blue'
                        : 'text-primary-dark hover:bg-customGray-5',
                    )}
                  >
                    <span
                      className={classNames(
                        'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border',
                        selected
                          ? 'border-primary-blue bg-primary-blue text-white'
                          : 'border-customGray-30 bg-white',
                      )}
                    >
                      {selected ? <CheckIcon className="h-3 w-3" /> : null}
                    </span>
                    <span className="truncate">{option}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
