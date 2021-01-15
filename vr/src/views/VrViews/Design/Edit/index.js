import React, { useState } from 'react'
import { Switch } from 'antd'
import { useDispatch, useSelector } from 'react-redux';

import {
  selectIsHotspot,
} from '../reselect'

import { actions } from '../reducers'


const Edit = () => {

  const isHotspot = useSelector(selectIsHotspot())
   const dispatch = useDispatch()

  const isHotspotChange = () => {
    dispatch(actions.changeIsHotspot())
  }

  return (
    <div>
      标注投放：  <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={isHotspot}  onChange={ ()=> isHotspotChange()} />{isHotspot.toString()}
    </div>
  )
}

export default Edit