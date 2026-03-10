'use client';

import { classNames } from '@/utils/utils';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRef, useState, useEffect } from 'react';

export interface SingleSelectDropdownProps {
  label: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  maxListHeight?: string;
}

export default function SingleSelectDropdown({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  helperText,
  maxListHeight = '200px',
}: SingleSelectDropdownProps) {
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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const hasValue = value.length > 0;

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
          hasValue
            ? 'border-primary-blue text-primary-blue bg-primary-blue/5'
            : 'border-customGray-10 text-primary-dark bg-white focus:border-primary-blue/50',
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <span className={classNames('truncate', hasValue ? 'text-primary-blue' : '')}>
          {hasValue ? value : placeholder}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasValue && (
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
                const selected = value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(option)}
                    className={classNames(
                      'w-full px-3 py-2 text-left text-sm font-inter transition-colors',
                      selected
                        ? 'bg-primary-blue/10 text-primary-blue'
                        : 'text-primary-dark hover:bg-customGray-5',
                    )}
                  >
                    {option}
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
