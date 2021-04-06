import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// imoprt styles from './index.less'
import { actions } from '../reducers'
import { selectIsHotspot, selectIsDelete, selectPanoramicData, selectProjectData, selectActiveId, selectAutoRotate } from '../reselect'

import { Switch, Form, Input, Select, Space, Card, Collapse } from 'antd'
// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

// const { SubMenu } = Menu
const { Option } = Select
// const { TreeNode } = TreeSelect
const { Panel } = Collapse
const Edit = () => {
    const dispatch = useDispatch()
    const isHotspot = useSelector(selectIsHotspot())
    const isDelete = useSelector(selectIsDelete())
    const panoramicData = useSelector(selectPanoramicData()) // 项目数据
    const projectData = useSelector(selectProjectData()) // 项目数据
    const activeId = useSelector(selectActiveId()) // 当前高亮视图ID
    console.log(activeId, '---activeId')
    const autoRotate = useSelector(selectAutoRotate())

    // const [activeConfig, setActiveConfig] = useState({
    //     //  // 配置信息
    //     name: '',
    //     id: '',
    //     url: '',
    //     active: true,
    //     autoRotate: false, //是否自动旋转
    //     // 锚点信息
    //     anchorPoint: [
    //         {
    //             point: {
    //                 x: 180.01349809670057,
    //                 y: 15.79023683858044,
    //                 z: 465.07418151652786,
    //             },
    //             id: '2102091411',
    //             name: '海边',
    //             iconUrl: 'haibian',
    //         },
    //     ],
    // })

    // 获取默认数据
    useEffect(() => {
        // setActiveConfig(panoramicData[0])
        // 并打开当前场景数据
        changeView(panoramicData[0].id)
    }, [])

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

    // 切换场景 根据点击ID 修改场景信息
    const changeView = key => {
        dispatch(actions.changeVrView(key))
        console.log(key)
    }

    useEffect(() => {
        console.log([activeId], '-----activeId')
    }, [activeId])

    // 获取到当前高亮数据信息 展示对应的设置信息
    // 如果没有切换 则默认设置 数据中第一项为 当前展示

    return (
        <div style={{ overflow: 'auto' }}>
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
                    <Form.Item name='note' label='是否自动旋转'>
                        <Switch
                            checkedChildren='开启'
                            unCheckedChildren='关闭'
                            checked={autoRotate}
                            onChange={useMemo(() => () => dispatch(actions.changeAutoRotate(!autoRotate)), [autoRotate, dispatch])}
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
                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}>
                            {({ getFieldValue }) => {
                                return getFieldValue('gender') === 'other' ? (
                                    <Form.Item name='customizeGender' label='Customize Gender' rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                ) : null
                            }}
                        </Form.Item>
                    </Form>
                </Card>
                <Card title={projectData.name} style={{ width: '100%' }}>
                    <Collapse onChange={changeView} accordion defaultActiveKey={[activeId]}>
                        {panoramicData.map(panoramic => {
                            return (
                                <Panel header={panoramic.name} key={panoramic.id}>
                                    <Collapse>
                                        {panoramic.anchorPoint.length &&
                                            panoramic.anchorPoint.map(anchor => {
                                                return <Panel header={anchor.name} key={anchor.id}></Panel>
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
