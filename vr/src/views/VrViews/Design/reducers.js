import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const initialState = {
    imgType: 'Auto',
    isHotspot: false, // 是否投放热点
    isDelete: false, // 是否删除热点
    activeId: '', //当前展示vr id
    autoRotate: false, //是否自动旋转
    // 全景图信息
    projectData: {
        name: '第一个项目',
        id: '2102271653',
        url: '',
        meta: '',
    },
    panoramicData: [
        {
            name: '会所',
            id: '2102271653',
            url: 'huisuo',
            active: true,

            // 锚点信息
            anchorPoint: [
                {
                    point: {
                        x: 180.01349809670057,
                        y: 15.79023683858044,
                        z: 465.07418151652786,
                    },
                    id: '2102091411',
                    name: '海边',
                    iconUrl: 'haibian',
                },
                {
                    point: {
                        x: 247.4793362659326,
                        y: -189.1800093391692,
                        z: 390.2798175065487,
                    },
                    id: '202102181619',
                    name: '客厅',
                    iconUrl: 'keting',
                },
            ],
        },
        {
            name: '海边',
            id: '2102091411',
            url: 'haibian',
            active: false,
            autoRotate: false,
            // 锚点信息
            anchorPoint: [
                {
                    point: {
                        x: 374.5454984418328,
                        y: -5.458415157221607,
                        z: 330.55353704327746,
                    },
                    id: '202102181621',
                    name: '豪宅',
                    iconUrl: 'haozhai',
                },
                {
                    point: {
                        x: 140.18787952741366,
                        y: -97.9969695393665,
                        z: 468.933553788003,
                    },
                    id: '202102181619',
                    name: '客厅',
                    iconUrl: 'keting',
                },
            ],
        },
        {
            name: '客厅',
            id: '202102181619',
            url: 'keting',
            active: false,
            autoRotate: false,
            // 锚点信息
            anchorPoint: [
                {
                    point: {
                        x: 481.8527362463277,
                        y: -24.6389543862957,
                        z: 127.17004633132723,
                    },
                    id: '2102271653',
                    name: '会所',
                    iconUrl: 'huisuo',
                },
                {
                    point: {
                        x: 347.09301641855546,
                        y: -109.56249057173801,
                        z: 341.54549425701236,
                    },
                    id: '2102091411',
                    name: '海边',
                    iconUrl: 'haibian',
                },
            ],
        },
        {
            name: '豪宅',
            id: '202102181621',
            url: 'haozhai',
            active: false,
            autoRotate: false,
            // 锚点信息
            anchorPoint: [
                {
                    point: {
                        x: 85.2120582814672,
                        y: -0.4428222360704279,
                        z: 492.0249309249495,
                    },
                    id: '2102271653',
                    name: '会所',
                    iconUrl: 'huisuo',
                },
                {
                    point: {
                        x: 441.06070438164795,
                        y: -157.51582618415583,
                        z: 173.01486267642798,
                    },
                    id: '2102091411',
                    name: '海边',
                    iconUrl: 'haibian',
                },
            ],
        },
    ],
    testData: {
        name: 'vr',
        id: '2102271653',
        panoramicData: [
            {
                name: '会所',
                id: '2102271653',
                url: 'huisuo',
                active: true,
                autoRotate: false,
                // 锚点信息
                anchorPoint: [
                    {
                        point: {
                            x: 180.01349809670057,
                            y: 15.79023683858044,
                            z: 465.07418151652786,
                        },
                        id: '2102091411',
                        name: '海边',
                        iconUrl: 'haibian',
                    },
                    {
                        point: {
                            x: 247.4793362659326,
                            y: -189.1800093391692,
                            z: 390.2798175065487,
                        },
                        id: '202102181619',
                        name: '客厅',
                        iconUrl: 'keting',
                    },
                ],
            },
            {
                name: '海边',
                id: '2102091411',
                url: 'haibian',
                active: false,
                autoRotate: false,
                // 锚点信息
                anchorPoint: [
                    {
                        point: {
                            x: 374.5454984418328,
                            y: -5.458415157221607,
                            z: 330.55353704327746,
                        },
                        id: '202102181621',
                        name: '豪宅',
                        iconUrl: 'haozhai',
                    },
                    {
                        point: {
                            x: 140.18787952741366,
                            y: -97.9969695393665,
                            z: 468.933553788003,
                        },
                        id: '202102181619',
                        name: '客厅',
                        iconUrl: 'keting',
                    },
                ],
            },
            {
                name: '客厅',
                id: '202102181619',
                url: 'keting',
                active: false,
                autoRotate: false,
                // 锚点信息
                anchorPoint: [
                    {
                        point: {
                            x: 481.8527362463277,
                            y: -24.6389543862957,
                            z: 127.17004633132723,
                        },
                        id: '2102271653',
                        name: '会所',
                        iconUrl: 'huisuo',
                    },
                    {
                        point: {
                            x: 347.09301641855546,
                            y: -109.56249057173801,
                            z: 341.54549425701236,
                        },
                        id: '2102091411',
                        name: '海边',
                        iconUrl: 'haibian',
                    },
                ],
            },
            {
                name: '豪宅',
                id: '202102181621',
                url: 'haozhai',
                active: false,
                autoRotate: false,
                // 锚点信息
                anchorPoint: [
                    {
                        point: {
                            x: 85.2120582814672,
                            y: -0.4428222360704279,
                            z: 492.0249309249495,
                        },
                        id: '2102271653',
                        name: '会所',
                        iconUrl: 'huisuo',
                    },
                    {
                        point: {
                            x: 441.06070438164795,
                            y: -157.51582618415583,
                            z: 173.01486267642798,
                        },
                        id: '2102091411',
                        name: '海边',
                        iconUrl: 'haibian',
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
            console.log(action.payload, state.activeId)
            console.log(state.panoramicData, '---這是數組啊')
            // state.panoramicData.anchorPoint = state.panoramicData.anchorPoint.push(action.payload)
        },
        // 编辑栏切换高亮数据
      changeVrView: (state, action) => {
          console.log('changebview 在改变')
            state.activeId = action.payload
        },
    },
})
export const actions = vrDesign.actions
export default vrDesign.reducer
