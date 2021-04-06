import { createSelector } from 'reselect'
import { initialState } from './reducers'

export const selectGlobal = state => {
    return state || {}
}

export const selectVrData = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject || initialState
    })

// ------------------- 视图编辑 --------------------
// 添加热点
export const selectIsHotspot = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject.isHotspot
    })

// 是否自动旋转
export const selectAutoRotate = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject.autoRotate
    })

// 删除热点
export const selectIsDelete = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject.isDelete
    })

// 每个项目的场景数据
export const selectPanoramicData = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject.panoramicData
    })

// 项目总数据
export const selectProjectData = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject.projectData
    })

// ---------------------展示---------------
//测试数据
export const selectTestData = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject.testData
    })

// ----------------------编辑栏---------

// 当前高亮id
export const selectActiveId = () =>
    createSelector(selectGlobal, state => {
        return state.OnLineProject.activeId
    })

// 当前选中的标注点 信息
export const selectEditAnchorPoint = () => createSelector(selectGlobal, state => state.OnLineProject.editAnchorPoint)
