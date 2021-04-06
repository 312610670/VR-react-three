import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../../api/index' // getScene
export const initialState = {
    imgType: 'Auto',
    isHotspot: false, // 是否投放热点
    isDelete: false, // 是否删除热点
    activeId: '', //当前展示vr id
    autoRotate: false, //是否自动旋转
    // 可编辑锚点信息
    editAnchorPoint: {
        uni_anchor_id: '', //object.uni_anchor_id',
        parentUuid: '', // parentUuid
        name: '', // object.name
        targect_scene_id: '', // object.targect_scene_id,
    },
    // 项目信息
    projectData: {
        name: '第一个项目',
        id: '2102271653',
        url: '',
        status: '',
        scene_list: '',
    },
    // 场景图信息
    panoramicData: [],
    testData: {
        name: 'vr',
        id: '2102271653',
        scene_list: [
            {
                id: 1,
                project_id: 1,
                name: 'scene_1-1',
                url: 'http://www.baidu.com/',
                is_default: 1,
                is_auto_ratate: 1,
                status: 0,
                anchor_list: [
                    {
                        id: 1,
                        scene_id: 1,
                        name: 'anchor_1-1',
                        url: 'http://www.baidu.com/',
                        x_axis: '180.01349809670057',
                        y_axis: '15.79023683858044',
                        z_axis: '465.07418151652786',
                        status: 0,
                    },
                    {
                        id: 2,
                        scene_id: 1,
                        name: 'anchor_1-2',
                        url: 'http://www.baidu.com/',
                        x_axis: '180.01349809670057',
                        y_axis: '16.79023683858044',
                        z_axis: '465.07418151652786',
                        status: 0,
                    },
                ],
            },
        ],
    },
    // 获取到的线上数据 z展示使用
    onLineData: {
        id: 1,
        name: 'test1',
        status: 0,
        scene_list: [
            {
                id: 1,
                project_id: 1,
                name: 'scene_1-1',
                url: 'http://www.baidu.com/',
                is_default: 1,
                is_auto_ratate: 1,
                status: 0,
                anchor_list: [
                    {
                        id: 1,
                        scene_id: 1,
                        name: 'anchor_1-1',
                        url: 'http://www.baidu.com/',
                        x_axis: '180.01349809670057',
                        y_axis: '15.79023683858044',
                        z_axis: '465.07418151652786',
                        status: 0,
                    },
                    {
                        id: 2,
                        scene_id: 1,
                        name: 'anchor_1-2',
                        url: 'http://www.baidu.com/',
                        x_axis: '180.01349809670057',
                        y_axis: '16.79023683858044',
                        z_axis: '465.07418151652786',
                        status: 0,
                    },
                ],
            },
            {
                id: 2,
                project_id: 1,
                name: 'scene_1-2',
                url: 'http://www.baidu.com/',
                is_default: 0,
                is_auto_ratate: 1,
                status: 0,
                anchor_list: [
                    {
                        id: 3,
                        scene_id: 2,
                        name: 'anchor_2-1',
                        url: 'http://www.baidu.com/',
                        x_axis: '181.01349809670057',
                        y_axis: '15.79023683858044',
                        z_axis: '465.07418151652786',
                        status: 0,
                    },
                    {
                        id: 4,
                        scene_id: 2,
                        name: 'anchor_2-1',
                        url: 'http://www.baidu.com/',
                        x_axis: '182.01349809670057',
                        y_axis: '15.79023683858044',
                        z_axis: '465.07418151652786',
                        status: 0,
                    },
                ],
            },
        ],
    },
}

export const saveTemplate = createAsyncThunk('vr/saveTemplate')

export const getProjectData = createAsyncThunk('vr/getProjectData', async id => {
    const res = await api.getProjectData(id)
    return res
})

// 获取场景信息
export const getScene = createAsyncThunk('vr/getScene', async id => {
    const res = await api.getScene(id)
    return res
})

const vrDesign = createSlice({
    name: 'vr',
    initialState,
    extraReducers(builder) {
        builder.addCase(getProjectData.fulfilled, (state, action) => {
            console.log(action.payload, '-action.payload')
            // state.panoramicData = action.payload;
        })
        builder.addCase(getScene.fulfilled, (state, action) => {
            if (action.payload.data.length > 0) {
                state.panoramicData = action.payload.data
                state.activeId = action.payload.data[0].uni_scene_id
            }
        })
    },
    reducers: {
        // 是否开启添加热点
        changeIsHotspot: (state, action) => {
            state.isHotspot = action.payload
        },
        // 是否开启删除热点
        changeIsDelete: (state, action) => {
            state.isDelete = action.payload
        },
        // 是否开启删除热点
        changeAutoRotate: (state, action) => {
            state.autoRotate = action.payload
        },

        // 添加热点数据
        addAnchorPoint: (state, action) => {
            let list = [...state.panoramicData]
            console.log(list, action.payload)
            list.forEach(item => {
                if (item.uni_scene_id === state.activeId) {
                    item.anchor_list.push(action.payload)
                }
            })
            state.panoramicData = list
        },

        // 编辑栏切换高亮数据
        changeVrView: (state, action) => {
            console.log('changebview 在改变')
            state.activeId = action.payload
        },

        // 设置项目数据
        changeProjectData: (state, action) => {
            state.projectData = action.payload
            state.panoramicData = action.payload.scene_list
        },

        // 添加场景
        addScence: (state, action) => {
            let list = [...state.panoramicData]
            state.panoramicData = list.concat(action.payload)
            // 获取所有可选中场景 并构建可选项
        },
        // 删除标注 ： 获取当前标注 uuid  获取父级ID
        deleteLabel: (state, actions) => {
            console.log(state.panoramicData, '--state')
            const { uuid, parentUuit } = actions.payload

            let list = JSON.parse(JSON.stringify(state.panoramicData))
            list.forEach(parent => {
                if (parent.uni_scene_id === parentUuit) {
                    parent.anchor_list.forEach(child => {
                        // if( child.ids ==  )
                        console.log(child, '--00')
                    })
                }
            })
        },
        // 选中标注 展示在左侧配置信息
        selectedLabel: (state, actions) => {
            // 选中的锚点信息
            state.editAnchorPoint = actions.payload
            //   获取信息
        },

        // 修改锚点信息
        handleEditAnchorPoint: (state, actions) => {
            // 当前修改的锚点信息  包含父及 子及
            // uni_anchor_id: '', //object.uni_anchor_id',
            // parentUuid: '', // parentUuid
            // state.editAnchorPoint
            let list = JSON.parse(JSON.stringify(state.panoramicData))
            list.forEach(element => {
                if (element.uni_scene_id === state.editAnchorPoint.parentUuid) {
                    console.log(element, '---element')
                    element.anchor_list.forEach(child => {
                        if (child.uni_anchor_id === state.editAnchorPoint.uni_anchor_id) {
                            console.log(child, 'hhhhh')
                            // name: '',
                            // target_scene_id: '',
                            Object.assign(child, actions.payload)
                        }
                    })
                }
            })
            console.log(list, '--list')
            state.panoramicData = list
            //   获取信息
            state.editAnchorPoint = {}
        },

        // 修改标注跳转信息
    },
})
export const actions = vrDesign.actions
export default vrDesign.reducer
