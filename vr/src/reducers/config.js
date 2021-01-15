/**
 * 页面配置
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  primaryColor: '#FF5F00', // todo: 配置化项目时，此处的值应该是动态的
  containerWidth: 1200,
};

// export type ConfigState = typeof initialState;

const config = createSlice({
  name: 'config',
  initialState,
  reducers: {},
});

// export reducer
export const configReducer = config.reducer;

// export action
export const configActions = config.actions;
