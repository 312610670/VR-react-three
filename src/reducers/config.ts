import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  primaryColor: '#FF5F00',
};

const config = createSlice({
  name: 'config',
  initialState,
  reducers: {},
});

export default config.reducer;
export const configActions = config.actions;
