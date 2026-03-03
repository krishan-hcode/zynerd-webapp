import {IAddress} from '@/account/types';
import {IUserData} from '@/global/UserContext';
import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

const initialState: {userInfo: IUserData | null} = {
  userInfo: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<IUserData>) => {
      state.userInfo = {
        ...action.payload,
        lastBannerDate: state.userInfo?.lastBannerDate || '',
      };
    },
    updateIsUserVerified: (
      state,
      action: PayloadAction<{tnc_approved: boolean}>,
    ) => {
      if (state.userInfo && typeof state.userInfo === 'object') {
        state.userInfo = {
          ...state.userInfo,
          ...action.payload,
        };
      } else {
        // @ts-ignore
        state.userInfo = {tnc_approved: action.payload.tnc_approved};
      }
    },
    updateAddress: (state, action: PayloadAction<IAddress>) => {
      if (state.userInfo && typeof state.userInfo === 'object') {
        state.userInfo = {
          ...state.userInfo,
          address_info: [action.payload],
        };
      } else {
        // @ts-ignore
        state.userInfo = {address_info: [action.payload]};
      }
    },
    updateSubscriptionBannerDate: (
      state,
      action: PayloadAction<{lastBannerDate: string}>,
    ) => {
      if (state?.userInfo) {
        state.userInfo.lastBannerDate = action.payload.lastBannerDate;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateUserData,
  updateIsUserVerified,
  updateAddress,
  updateSubscriptionBannerDate,
} = userSlice.actions;

export default userSlice.reducer;
