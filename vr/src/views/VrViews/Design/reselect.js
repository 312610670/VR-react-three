import { createSelector } from 'reselect';
import { initialState } from './reducers';

export const selectGlobal = (state) => {
  return state || {};
};

export const selectVrData = () =>
  createSelector(selectGlobal, (state) => {
    return state.vrData || initialState
  });

export const selectIsHotspot = () => 
  createSelector(selectGlobal, (state) => {
    return state.vrData.isHotspot 
  });