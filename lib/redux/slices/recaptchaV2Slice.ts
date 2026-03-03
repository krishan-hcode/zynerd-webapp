import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: {isVerified: boolean} = {isVerified: false};

export const recaptchaV2Slice = createSlice({
  name: 'recaptchaV2',
  initialState,
  reducers: {
    setRecaptchaV2: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
  },
});

export const {setRecaptchaV2} = recaptchaV2Slice.actions;

export default recaptchaV2Slice.reducer;
