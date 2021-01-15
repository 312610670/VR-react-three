import { createSelector } from 'reselect';
import { initialState } from './config';

const selectConfig = (state) => state.config || initialState;

export const selectUserInfo = () =>
  createSelector(selectConfig, (state) => {
    return state.data;
  });
export const selectUserInfoIsLoaded = () =>
  createSelector(selectConfig, (state) => {
    return state.isLoaded;
  });
