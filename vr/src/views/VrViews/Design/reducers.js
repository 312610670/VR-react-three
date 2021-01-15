import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const initialState = {
  imgType: 'Auto',
  isHotspot: false,
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
      changeIsHotspot (state) {
        state.isHotspot = !state.isHotspot
      }
    }
  }
)
export const actions = vrDesign.actions;
export default vrDesign.reducer
