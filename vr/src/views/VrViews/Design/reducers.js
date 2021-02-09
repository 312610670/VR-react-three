import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const initialState = {
  imgType: 'Auto',
  isHotspot: false, // 是否投放热点
  isDelete: false, // 是否删除热点
  // 全景图信息

  projectData: {
    name: '第一个项目',
    id: '2102271653',
    url: '',
    meta: ''
  },
  panoramicData: [
    {
      name: '第一个场景',
      id: '2102271653',
      url: '',
      active: true,
      // 锚点信息
      anchorPoint: [
        {
          point: {
            x:176.75034567870438,
            y: -19.09902720876184,
            z: 466.1877327588506,
          },
          id: '1-1',
          name: '这是第一个锚点',
          iconUrl: ''
        },
        {
          point: {
            x:247.4793362659326,
            y: -189.1800093391692,
            z: 390.2798175065487,
          },
          id: '1-2',
          name: '这是第二个锚点',
          iconUrl: ''
        },
      ]
    },
    {
      name: '第二个场景',
      id: '2102091411',
      url: '',
      active: false,
      // 锚点信息
      anchorPoint: [
        {
          point: {
            x:176.75034567870438,
            y: -19.09902720876184,
            z: 466.1877327588506,
          },
          id: '2-1',
          name: '这是2-1锚点',
          iconUrl: ''
        },
        {
          point: {
            x:247.4793362659326,
            y: -189.1800093391692,
            z: 390.2798175065487,
          },
          id: '2-2',
          name: '这是2-2锚点',
          iconUrl: ''
        },
      ]
    }
  ]
}

export const saveTemplate = createAsyncThunk(
  'vr/saveTemplate',

)

const vrDesign = createSlice(
  {
    name: 'vr',
    initialState,
    extraReducers (builder) {
      
    },
    reducers: {
      changeIsHotspot: (state, action) => {
        state.isHotspot = action.payload
      },
      changeIsDelete: (state, action) => {
        state.isDelete = action.payload
      },
      addAnchorPoint: (state, action) => {
        console.log(action.payload)
        console.log(state.panoramicData,'---這是數組啊')
        // state.panoramicData.anchorPoint = state.panoramicData.anchorPoint.push(action.payload)
      }
    }
  }
)
export const actions = vrDesign.actions;
export default vrDesign.reducer
