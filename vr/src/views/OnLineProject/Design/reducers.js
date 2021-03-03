import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const initialState = {
    imgType: 'Auto',
    isHotspot: false, // 是否投放热点
    isDelete: false, // 是否删除热点
    activeId: '', //当前展示vr id
    autoRotate: false, //是否自动旋转
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
    // 获取到的线上数据
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

const vrDesign = createSlice({
    name: 'vr',
    initialState,
    extraReducers(builder) {},
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
            console.log(list, action.payload, '改变当前场景 获取所有数据设置对一个参数')
            state.panoramicData = list.concat(action.payload)
          
        },
    },
})
export const actions = vrDesign.actions
export default vrDesign.reducer
