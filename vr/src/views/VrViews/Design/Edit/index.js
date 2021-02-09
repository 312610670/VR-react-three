import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// imoprt styles from './index.less'
import { actions } from '../reducers'
import {
    selectIsHotspot,
    selectIsDelete,
    selectPanoramicData,
    selectProjectData,
} from '../reselect'

import { Switch, Menu, Form, Input, Select, Space, Card, TreeSelect, Collapse } from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

const { SubMenu } = Menu
const { Option } = Select
const { TreeNode } = TreeSelect
const { Panel } = Collapse
const Edit = () => {
    const dispatch = useDispatch()
    const isHotspot = useSelector(selectIsHotspot())
    const isDelete = useSelector(selectIsDelete())
    const panoramicData = useSelector(selectPanoramicData()) // 项目数据
    const projectData = useSelector(selectProjectData()) // 项目数据

    // 投放标注
    const isHotspotChange = () => {
        dispatch(actions.changeIsHotspot(!isHotspot))
    }
    const handleClick = e => {
        console.log('click ', e)
    }

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

    console.log(projectData, '--projectData')

    const callback = key => {
        console.log(key)
    }

    return (
        <div>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Card title='操作台' style={{ width: '100%' }}>
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
                </Card>
                <Card title='配置信息' style={{ width: '100%' }}>
                    <Form>
                        <Form.Item name='note' label='锚点名称' rules={[{ required: true }]}>
                            <Input style={{ width: 120 }} />
                        </Form.Item>
                        <Form.Item name='gender' label='跳转场景' rules={[{ required: true }]}>
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
                </Card>
                <Card title={projectData.name} style={{ width: '100%' }}>
                    <Collapse onChange={callback} accordion>
                        {panoramicData.map(panoramic => {
                            return (
                                <Panel header={panoramic.name} key={panoramic.id}>
                                    <Collapse defaultActiveKey='1'>
                                        {panoramic.anchorPoint.length &&
                                            panoramic.anchorPoint.map(anchor => {
                                                return (
                                                    <Panel header={anchor.name} key={anchor.id}>
                                                        
                                                    </Panel>
                                                )
                                            })}
                                    </Collapse>
                                </Panel>
                            )
                        })}
                    </Collapse>
                </Card>
            </Space>
        </div>
    )
}

export default Edit
