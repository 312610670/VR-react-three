import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// imoprt styles from './index.less'
import { v4 as uuidv4 } from 'uuid'

import { actions } from '../reducers'
import {
    selectIsHotspot,
    selectIsDelete,
    selectPanoramicData,
    selectProjectData,
    selectActiveId,
    selectAutoRotate,
} from '../reselect'

import {
    Switch,
    Menu,
    Form,
    Input,
    Select,
    Space,
    Card,
    TreeSelect,
    Collapse,
    Modal,
    Button,
    Upload,
} from 'antd'
import { PlusSquareOutlined, UploadOutlined } from '@ant-design/icons'

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
    const activeId = useSelector(selectActiveId()) // 当前高亮视图ID

    const autoRotate = useSelector(selectAutoRotate())

    console.log(panoramicData,'-修改后左边栏')
    const [activeConfig, setActiveConfig] = useState({
        // 配置信息
        name: '',
        id: '',
        url: '',
        active: true,
        autoRotate: false, //是否自动旋转
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
        ],
    })

    const [nPjData, setNPjData] = useState({
        scenceid: '',
        name: '',
        url: '',
        is_default: 1,
        status: 0,
        anchor_list: [],
    })

    const [isModalVisible, setIsModalVisible] = useState(false)
    // 获取默认数据
    useEffect(() => {
        setActiveConfig(panoramicData[0])
        if (panoramicData.length > 0) {
            // 并打开当前场景数据
            changeView(panoramicData[0].id)
        }
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

    const openModal = () => {
        setNPjData({
            uni_scene_id: '',
            name: '',
            url: '',
            is_default: 1,
            status: 0,
            anchor_list: [],
        })
        setIsModalVisible(true)
    }
    // 保存数据 添加到场景数据 关闭弹窗
  const handleOk = () => {
      let  activeId = uuidv4()
      let endScen = Object.assign(nPjData, { uni_scene_id: activeId, url: 'huisuo' })
      dispatch(actions.changeVrView(activeId))
      dispatch(actions.addScence(endScen))
      setIsModalVisible(false)
    }

    // 清空参数 关闭弹窗
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    // 获取到当前高亮数据信息 展示对应的设置信息
    // 如果没有切换 则默认设置 数据中第一项为 当前展示

    return (
        <div style={{ overflow: 'auto' }}>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Card title='操作台' style={{ width: '100%' }}>
                    <Button
                        block
                        icon={<PlusSquareOutlined />}
                        onClick={() => {
                            openModal()
                        }}
                        type='primary'
                        ghost
                    >
                        添加场景
                    </Button>
                    <Form.Item name='' label='标注投放：'>
                        <Switch
                            checkedChildren='开启'
                            unCheckedChildren='关闭'
                            checked={isHotspot}
                            onChange={() => dispatch(actions.changeIsHotspot(!isHotspot))}
                        />
                    </Form.Item>
                    <Form.Item name='' label='是否删除标注'>
                        <Switch
                            checkedChildren='开启'
                            unCheckedChildren='关闭'
                            checked={isDelete}
                            onChange={() => dispatch(actions.changeIsDelete(!isDelete))}
                        />
                    </Form.Item>
                    <Form.Item name='' label='是否自动旋转'>
                        <Switch
                            checkedChildren='开启'
                            unCheckedChildren='关闭'
                            checked={autoRotate}
                            onChange={useMemo(
                                () => () => dispatch(actions.changeAutoRotate(!autoRotate)),
                                [autoRotate, dispatch]
                            )}
                        />
                    </Form.Item>
                </Card>
                <Card title='配置信息' style={{ width: '100%' }}>
                    <Form>
                        <Form.Item name='' label='锚点名称' rules={[{ required: true }]}>
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
                    <Collapse onChange={changeView} accordion defaultActiveKey={[activeId]}>
                        {panoramicData.map(panoramic => {
                            return (
                                <Panel header={panoramic.name} key={panoramic.scend}>
                                    <Collapse>
                                        {panoramic.anchor_list && panoramic.anchor_list.length &&
                                            panoramic.anchor_list.map(anchor => {
                                                return (
                                                    <Panel
                                                        header={anchor.name}
                                                        key={anchor.id}
                                                    ></Panel>
                                                )
                                            })}
                                    </Collapse>
                                </Panel>
                            )
                        })}
                    </Collapse>
                </Card>
            </Space>
            <Modal
                title='请上传全景图'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item label='锚点名称' rules={[{ required: true }]}>
                        <Input
                            style={{ width: 120 }}
                            onChange={e => {
                                setNPjData(Object.assign(nPjData, { name: e.target.value }))
                            }}
                        />
                    </Form.Item>
                    <Form.Item label='请上传全景图片' rules={[{ required: true }]}>
                        <Upload
                            onChange={e => {
                                console.log(e, '文件該斌')
                            }}
                            listType='picture'
                            beforeUpload={file => {
                                console.log(file, '----')
                                return new Promise(resolve => {
                                    const reader = new FileReader()
                                    reader.readAsDataURL(file)
                                    reader.onload = () => {
                                        const img = document.createElement('img')
                                        img.src = reader.result
                                        img.onload = () => {
                                            const canvas = document.createElement('canvas')
                                            canvas.width = img.naturalWidth
                                            canvas.height = img.naturalHeight
                                            const ctx = canvas.getContext('2d')
                                            ctx.drawImage(img, 0, 0)
                                            ctx.fillStyle = 'red'
                                            ctx.textBaseline = 'middle'
                                            ctx.font = '33px Arial'
                                            ctx.fillText('Ant Design', 20, 20)
                                            canvas.toBlob(resolve)
                                        }
                                    }
                                })
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Edit
