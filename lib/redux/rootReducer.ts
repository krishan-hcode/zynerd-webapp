import {combineReducers} from '@reduxjs/toolkit';
import projectConfigSlice from './slices/projectConfigSlice';
import recaptchaReducer from './slices/recaptchaV2Slice';

import userReducer from './slices/userSlice';
import storage from './storage';

const rootReducer = combineReducers({
  user: userReducer,
  recaptchaV2: recaptchaReducer,
  projectConfig: projectConfigSlice,
});

export const resetStore = () => ({
  type: 'RESET_STORE',
});

const appReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    storage.removeItem('persist:root');
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

export default appReducer;
