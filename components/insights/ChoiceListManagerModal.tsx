import Modal from '@/common/Modal';
import type { ChoiceListMode } from '@/insights/choiceList.types';
import { classNames } from '@/utils/utils';
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';

interface ChoiceListManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: Array<{
    id: string;
    name: string;
    itemCount: number;
  }>;
  mode: ChoiceListMode;
  activeChoiceListId?: string;
  onCreateList: (name: string) => void;
  onSelectList: (listId: string) => void;
  onSelectAskEverytime: () => void;
}

export default function ChoiceListManagerModal({
  isOpen,
  onClose,
  lists,
  mode,
  activeChoiceListId,
  onCreateList,
  onSelectList,
  onSelectAskEverytime,
}: ChoiceListManagerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newListName, setNewListName] = useState('');
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);

  const filteredLists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return lists;
    return lists.filter(list => list.name.toLowerCase().includes(query));
  }, [lists, searchQuery]);

  const handleCreate = () => {
    const value = newListName.trim();
    if (!value) return;
    onCreateList(value);
    setNewListName('');
    setIsCreatingNewList(false);
  };

  const modeLabel = mode === 'askEveryTime' ? 'Ask everytime' : 'Ask everytime';
  const isAskEverytimeSelected = !activeChoiceListId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon={false}
      containerAdditionalClasses="max-w-2xl max-h-[85vh] p-0 flex flex-col rounded-2xl"
    >
      <div className="flex items-center justify-between border-b border-customGray-10 bg-gradient-to-r from-white to-customGray-3/40 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-primary-dark font-inter">Choice List</h2>
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
        <button
          type="button"
          onClick={onSelectAskEverytime}
          className={classNames(
            'mb-4 flex w-full items-center justify-between rounded-xl border border-customGray-10 px-4 py-3 text-left transition-all',
            isAskEverytimeSelected ? 'bg-primary-blue/5 border-primary-blue/30 shadow-sm' : 'bg-white hover:border-primary-blue/20 hover:bg-customGray-3',
          )}
        >
          <span className="text-sm font-semibold text-primary-dark font-inter">{modeLabel}</span>
          {isAskEverytimeSelected ? <CheckCircleIcon className="h-6 w-6 text-primary-blue" /> : null}
        </button>
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex flex-1 items-center gap-4">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-customGray-50" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Choice List"
              className="h-11 w-full rounded-xl border border-customGray-10 bg-customGray-3/60 pl-11 pr-4 text-sm text-primary-dark outline-none focus:border-primary-blue/40"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsCreatingNewList(true)}
            className="ml-2 inline-flex items-center gap-1 rounded-xl border border-customGray-10 bg-white px-3 py-2 text-sm font-medium text-primary-blue shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-blue/30"
          >
            <PlusIcon className="h-5 w-5" />
            Create new list
          </button>
        </div>

        {isCreatingNewList ? (
          <div className="my-4 flex items-center justify-between gap-3 rounded-xl border border-customGray-10 bg-customGray-3/50 p-3">
            <div className="flex flex-1 items-center gap-2">
              <input
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                placeholder="List name"
                className="h-10 w-full rounded-xl border border-customGray-10 bg-white px-3 text-sm outline-none focus:border-primary-blue/40"
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleCreate();
                  }
                }}
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-xl bg-primary-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreatingNewList(false);
                setNewListName('');
              }}
              className="rounded-xl border border-customGray-20 bg-white px-4 py-2 text-sm font-semibold text-customGray-70 hover:bg-customGray-5"
            >
              Cancel
            </button>
          </div>
        ) : null}

        <div className="my-4 space-y-2 rounded-2xl bg-white ">
          {filteredLists.map(list => (
            <button
              key={list.id}
              type="button"
              onClick={() => onSelectList(list.id)}
              className={classNames(
                'flex w-full items-center justify-between rounded-xl border border-customGray-10 px-4 py-3 text-left transition-all',
                activeChoiceListId === list.id ? 'border-primary-blue/30 bg-primary-blue/5 shadow-sm' : 'bg-white hover:border-primary-blue/20 hover:bg-customGray-3',
              )}
            >
              <div>
                <p className="text-sm font-semibold text-primary-dark font-inter">{list.name}</p>
                <p className="text-xs text-customGray-70 font-inter">{list.itemCount} Choices</p>
              </div>
              {activeChoiceListId === list.id ? (
                <CheckCircleIcon className="h-6 w-6 text-primary-blue" />
              ) : null}
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
