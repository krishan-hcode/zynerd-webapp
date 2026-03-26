export type ChoiceListMode = 'askEveryTime';

export interface ChoiceList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  itemIds: string[];
}

export interface ChoiceListPreferences {
  mode: ChoiceListMode;
}

export interface ChoiceListState {
  lists: ChoiceList[];
  preferences: ChoiceListPreferences;
  activeChoiceListId?: string;
}

export interface ChoiceListRepository {
  loadChoiceLists: () => ChoiceListState;
  saveChoiceLists: (state: ChoiceListState) => void;
}
