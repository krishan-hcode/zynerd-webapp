import Modal from '@/common/Modal';
import counsellingsData from '@/data/counsellingsData.json';
import type {ICounselling} from '@/types/counsellings.types';
import {classNames} from '@/utils/utils';
import {ChevronRightIcon, MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {useMemo, useState} from 'react';

const {ALL_COUNSELLINGS} = counsellingsData as {ALL_COUNSELLINGS: ICounselling[]};

interface CounsellingSelectModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectCounselling: (counselling: ICounselling) => void;
}

export default function CounsellingSelectModal({
  title,
  isOpen,
  onClose,
  onSelectCounselling,
}: CounsellingSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCounsellings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_COUNSELLINGS;
    return ALL_COUNSELLINGS.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleSelect = (counselling: ICounselling) => {
    onSelectCounselling(counselling);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon
      containerAdditionalClasses="max-w-md"
      backdropBlur
    >
      <div className="pr-8">
        <h2 className="text-lg font-semibold text-primary-dark font-besley">
          {title}
        </h2>
      </div>
      <div className="mt-4">
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-customGray-50"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search Counselling"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search counselling"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-customGray-10 text-primary-dark font-inter text-sm placeholder:text-customGray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
          />
        </div>
      </div>
      <div
        className="mt-4 max-h-[60vh] overflow-y-auto -mx-1"
        role="list"
        aria-label="Counselling options"
      >
        {filteredCounsellings.length === 0 ? (
          <p className="py-6 text-sm text-customGray-50 text-center font-inter">
            No counsellings found
          </p>
        ) : (
          filteredCounsellings.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="listitem"
              onClick={() => handleSelect(item)}
              className={classNames(
                'w-full flex items-center justify-between gap-3 px-3 py-3 text-left rounded-lg font-inter text-sm text-primary-dark hover:bg-customGray-5 transition-colors',
                index > 0 ? 'border-t border-customGray-10' : '',
              )}
            >
              <span className="min-w-0 flex-1">{item.name}</span>
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-customGray-50" />
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}
