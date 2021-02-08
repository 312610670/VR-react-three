import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Menu } from 'antd'
import { selectIsHotspot, selectIsDelete } from '../reselect'

import { actions } from '../reducers'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

const { SubMenu } = Menu

const Edit = () => {
    const isHotspot = useSelector(selectIsHotspot())
    const isDelete = useSelector(selectIsDelete())
    const dispatch = useDispatch()

  // 投放标注
    const isHotspotChange = () => {
        dispatch(actions.changeIsHotspot(!isHotspot))
    }
    const handleClick = e => {
        console.log('click ', e)
    }

    // 大项目对象
    let projectData = [
        {
            Scenes: '场景1',
            url: '', //背景全景
            img: '', // 缩略图
            anchorPoint: [{}],
        },
    ]
    return (
        <>
            <div>
                标注投放：{' '}
                <Switch
                    checkedChildren='开启'
                    unCheckedChildren='关闭'
                    checked={isHotspot}
                    onChange={() =>  dispatch(actions.changeIsHotspot(!isHotspot))}
                />
        </div>
        <div>
                是否删除标注{' '}
                <Switch
                    checkedChildren='开启'
                    unCheckedChildren='关闭'
                    checked={isDelete}
                    onChange={() => dispatch(actions.changeIsDelete(!isDelete))}
                />
            </div>
            <Menu
                onClick={() => {
                    handleClick()
                }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode='inline'
            >
                <SubMenu key='sub1' icon={<MailOutlined />} title='项目名称'>
                    <Menu.ItemGroup key='g1' title='场景名1'>
                        <Menu.Item key='1'>锚点连接1</Menu.Item>
                        <Menu.Item key='2'>锚点连接2</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key='g2' title='场景名2'>
                        <Menu.Item key='3'>锚点连接1</Menu.Item>
                        <Menu.Item key='4'>锚点连接2</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu>
            </Menu>
        </>
    )
}

export default Edit
