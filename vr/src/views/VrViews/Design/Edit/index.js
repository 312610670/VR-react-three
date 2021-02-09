import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../reducers'
import { selectIsHotspot, selectIsDelete, selectPanoramicData } from '../reselect'


import { Switch, Menu, Form, Input, Select } from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

const { SubMenu } = Menu
const { Option } = Select
const Edit = () => {
    const dispatch = useDispatch()
    const isHotspot = useSelector(selectIsHotspot())
    const isDelete = useSelector(selectIsDelete())
    const panoramicData = useSelector(selectPanoramicData()) // 项目数据

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
    const [form] = Form.useForm()
    const onGenderChange = value => {
        switch (value) {
            case 'male':
                form.setFieldsValue({ note: 'Hi, man!' })
                return
            case 'female':
                form.setFieldsValue({ note: 'Hi, lady!' })
                return
            case 'other':
                form.setFieldsValue({ note: 'Hi there!' })
                return
            default:
                return
        }
    }

    return (
        <div>
            <Form.Item name='note' label='标注投放：'>
                <Switch
                    checkedChildren='开启'
                    unCheckedChildren='关闭'
                    checked={isHotspot}
                    onChange={() => dispatch(actions.changeIsHotspot(!isHotspot))}
                />
            </Form.Item>
            <Form.Item name='note' label='是否删除标注'>
                <Switch
                    checkedChildren='开启'
                    unCheckedChildren='关闭'
                    checked={isDelete}
                    onChange={() => dispatch(actions.changeIsDelete(!isDelete))}
                />
            </Form.Item>

            <Form>
                <Form.Item name='note' label='Note' rules={[{ required: true }]}>
                    <Input style={{ width: 120 }} />
                </Form.Item>
                <Form.Item name='gender' label='Gender' rules={[{ required: true }]}>
                    <Select
                        style={{ width: 120 }}
                        placeholder='Select a option and change input text above'
                        onChange={onGenderChange}
                        allowClear
                    >
                        <Option value='male'>male</Option>
                        <Option value='female'>female</Option>
                        <Option value='other'>other</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.gender !== currentValues.gender
                    }
                >
                    {({ getFieldValue }) => {
                        return getFieldValue('gender') === 'other' ? (
                            <Form.Item
                                name='customizeGender'
                                label='Customize Gender'
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        ) : null
                    }}
                </Form.Item>
            </Form>

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
        </div>
    )
}

export default Edit
