import Modal from '@/common/Modal';
import { classNames } from '@/utils/utils';
import {
  HeartIcon as HeartIconOutline,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';

interface ChoiceListAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: Array<{
    id: string;
    name: string;
    itemCount: number;
    isSelected: boolean;
  }>;
  onToggleList: (listId: string) => void;
}

export default function ChoiceListAssignmentModal({
  isOpen,
  onClose,
  lists,
  onToggleList,
}: ChoiceListAssignmentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return lists;
    return lists.filter(list => list.name.toLowerCase().includes(query));
  }, [lists, searchQuery]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon={false}
      containerAdditionalClasses="max-w-2xl max-h-[85vh] p-0 flex flex-col rounded-2xl"
    >
      <div className="flex items-center justify-between border-b border-customGray-10 bg-gradient-to-r from-white to-customGray-3/40 px-6 py-4">
        <div>
          <p className="text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
            Quick Assignment
          </p>
          <h2 className="text-lg font-semibold text-primary-dark font-inter">Add to Choice List</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-customGray-90 hover:bg-customGray-5"
          aria-label="Close"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-customGray-3/20 px-6 py-5">
        <div className="relative mb-5">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-customGray-50" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Choice List"
            className="h-11 w-full rounded-xl border border-customGray-10 bg-customGray-3/60 pl-11 pr-4 text-sm text-primary-dark outline-none focus:border-primary-blue/40"
          />
        </div>

        <div className="space-y-2 rounded-2xl border border-customGray-10 bg-white p-2">
          {filteredLists.map(list => (
            <button
              key={list.id}
              type="button"
              onClick={() => onToggleList(list.id)}
              className={classNames(
                'flex w-full items-center justify-between rounded-xl border border-customGray-10 px-4 py-3 text-left transition-all',
                list.isSelected ? 'border-secondary-lightRed/30 bg-secondary-lightRed/5 shadow-sm' : 'bg-white hover:border-primary-blue/20 hover:bg-customGray-3',
              )}
            >
              <div className="flex items-center gap-3">
                {list.isSelected ? (
                  <HeartIconSolid className="h-7 w-7 text-secondary-lightRed" />
                ) : (
                  <HeartIconOutline className="h-7 w-7 text-secondary-lightRed/40" />
                )}
                <div>
                  <p className="text-sm font-semibold text-primary-dark font-inter">{list.name}</p>
                  <p className="text-xs text-customGray-70 font-inter">{list.itemCount} Choices</p>
                </div>
              </div>
            </button>
          ))}
          {filteredLists.length === 0 && (
            <p className="py-6 text-center text-sm text-customGray-50 font-inter">No lists found.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-customGray-10 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-primary-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
