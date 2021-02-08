import { createSelector } from 'reselect';
import { initialState } from './reducers';

export const selectGlobal = (state) => {
  return state || {};
};

export const selectVrData = () =>
  createSelector(selectGlobal, (state) => {
    return state.vrData || initialState
  });

  // 添加热点
export const selectIsHotspot = () => 
  createSelector(selectGlobal, (state) => {
    return state.vrData.isHotspot 
  });

  // 删除热点
  export const selectIsDelete = () => 
  createSelector(selectGlobal, (state) => {
    return state.vrData.isDelete 
  });


  // 每个项目的单独数据
export const selectPanoramicData = () =>
  createSelector(selectGlobal, (state) => {
    return state.vrData.panoramicData 
})