import type { ChoiceList, ChoiceListRepository, ChoiceListState } from '@/insights/choiceList.types';

const CHOICE_LIST_STORAGE_KEY_PREFIX = 'insights.choiceLists.v2.counselling';

export const DEFAULT_CHOICE_LIST_STATE: ChoiceListState = {
  lists: [],
  preferences: {
    mode: 'askEveryTime',
  },
  activeChoiceListId: undefined,
};

function normalizeChoiceListState(value: unknown): ChoiceListState {
  if (!value || typeof value !== 'object') return DEFAULT_CHOICE_LIST_STATE;

  const maybeState = value as Partial<ChoiceListState>;
  const rawLists = Array.isArray(maybeState.lists) ? maybeState.lists : [];

  const lists: ChoiceList[] = rawLists
    .map(list => {
      const itemIds = Array.isArray((list as ChoiceList).itemIds)
        ? (list as ChoiceList).itemIds.filter(itemId => typeof itemId === 'string')
        : [];
      if (
        typeof (list as ChoiceList).id !== 'string' ||
        typeof (list as ChoiceList).name !== 'string' ||
        typeof (list as ChoiceList).createdAt !== 'string' ||
        typeof (list as ChoiceList).updatedAt !== 'string'
      ) {
        return null;
      }
      return {
        id: (list as ChoiceList).id,
        name: (list as ChoiceList).name,
        createdAt: (list as ChoiceList).createdAt,
        updatedAt: (list as ChoiceList).updatedAt,
        itemIds,
      };
    })
    .filter((list): list is ChoiceList => Boolean(list));

  return {
    lists,
    preferences: {
      mode: 'askEveryTime',
    },
    activeChoiceListId:
      typeof maybeState.activeChoiceListId === 'string' &&
      lists.some(list => list.id === maybeState.activeChoiceListId)
        ? maybeState.activeChoiceListId
        : undefined,
  };
}

export const localChoiceListRepository: ChoiceListRepository = {
  loadChoiceLists: (scopeKey: string) => {
    if (typeof window === 'undefined') return DEFAULT_CHOICE_LIST_STATE;
    try {
      const storageKey = `${CHOICE_LIST_STORAGE_KEY_PREFIX}.${scopeKey}`;
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return DEFAULT_CHOICE_LIST_STATE;
      const parsed = JSON.parse(raw);
      return normalizeChoiceListState(parsed);
    } catch {
      return DEFAULT_CHOICE_LIST_STATE;
    }
  },
  saveChoiceLists: (scopeKey: string, state: ChoiceListState) => {
    if (typeof window === 'undefined') return;
    const storageKey = `${CHOICE_LIST_STORAGE_KEY_PREFIX}.${scopeKey}`;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  },
};

export function createChoiceList(name: string): ChoiceList {
  const now = new Date().toISOString();
  return {
    id: `choice-list-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    createdAt: now,
    updatedAt: now,
    itemIds: [],
  };
}

export function toggleRecordInList(
  state: ChoiceListState,
  recordId: string,
  listId: string,
): ChoiceListState {
  return {
    ...state,
    lists: state.lists.map(list => {
      if (list.id !== listId) return list;
      const hasRecord = list.itemIds.includes(recordId);
      return {
        ...list,
        updatedAt: new Date().toISOString(),
        itemIds: hasRecord
          ? list.itemIds.filter(itemId => itemId !== recordId)
          : [...list.itemIds, recordId],
      };
    }),
  };
}

export function getRecordChoiceListCount(state: ChoiceListState, recordId: string): number {
  return state.lists.reduce((count, list) => count + (list.itemIds.includes(recordId) ? 1 : 0), 0);
}

export function isRecordInActiveChoiceList(state: ChoiceListState, recordId: string): boolean {
  if (!state.activeChoiceListId) {
    return state.lists.some(list => list.itemIds.includes(recordId));
  }

  const activeList = state.lists.find(list => list.id === state.activeChoiceListId);
  if (!activeList) return false;
  return activeList.itemIds.includes(recordId);
}
