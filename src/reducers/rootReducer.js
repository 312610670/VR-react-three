/**
 * 根 reducer
 */
import { combineReducers } from '@reduxjs/toolkit';

// 子 reducer
import { configReducer } from './config';
// import { userInfoReducer } from './userInfo';

// 始终存在的 reducer
export const staticReducers = {
  config: configReducer,
  // userInfo: userInfoReducer,
};

export default combineReducers(staticReducers);
