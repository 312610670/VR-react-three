import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import COS from 'cos-js-sdk-v5'

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
    // Menu,
    Form,
    Input,
    Select,
    Space,
    Card,
    // TreeSelect,
    Collapse,
    Modal,
    Button,
    Upload,
    message,
} from 'antd'

import { getKey, uploadBase } from '../../../../api/index'
import { PlusSquareOutlined, UploadOutlined } from '@ant-design/icons'

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
    // eslint-disable-next-line no-restricted-globals
    const protocol = location.protocol === 'https:' ? 'https:' : 'http:'
    // prefix 用于拼接请求 url 的前缀，域名使用存储桶的默认域名
    const prefix = protocol + '//vr-demo-1255877297.cos.ap-guangzhou.myqcloud.com/'

    console.log(prefix, '---prefix')
    // 对更多字符编码的 url encode 格式
    const camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
    }

    const autoRotate = useSelector(selectAutoRotate())
    // 新增场景表单
    const [sceneForm] = Form.useForm()
    // 配置信息表单
    const [configForm] = Form.useForm()

    const [secretKey, setSecretKey] = useState({})

    const cosRef = useRef()

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

    // 创建新项目使用数据
    const [createProject, setCreateProject] = useState({
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

    useEffect(() => {
        if (JSON.stringify(secretKey) !== '{}') {
            cosRef.current = new COS({
                SecretId: secretKey.temp_key.credentials.tmpSecretId,
                SecretKey: secretKey.temp_key.credentials.tmpSecretKey,
            })
        }
    }, [secretKey])

    // 配置信息
    const onGenderChange = value => {
        switch (value) {
            case 'male':
                configForm.setFieldsValue({ note: 'Hi, man!' })
                return
            case 'female':
                configForm.setFieldsValue({ note: 'Hi, lady!' })
                return
            case 'other':
                configForm.setFieldsValue({ note: 'Hi there!' })
                return
            default:
                return
        }
    }

    // 切换场景 根据点击ID 修改场景信息
    const changeView = key => {
        console.log(key, activeId, '当前高亮')
        if (key && key !== activeId) {
            console.log('执行changeg')
            dispatch(actions.changeVrView(key))
        }
    }

    // 打开新增场景弹窗
    const openModal = () => {
        sceneForm.resetFields()
        setCreateProject({
            uni_scene_id: '',
            name: '',
            url: '',
            is_default: 1,
            status: 0,
            anchor_list: [],
        })
        setIsModalVisible(true)
        getKey().then(res => {
            if (res.status) {
                setSecretKey(res.data)
            }
            console.log(res, '0000')
        })
    }
    // 保存数据 添加到场景数据 关闭弹窗
    const handleOk = () => {
        sceneForm
            .validateFields()
            .then(res => {
                console.log(res, '---sceneForm')
                let activeId = uuidv4()
                let endScen = Object.assign(createProject, {
                    uni_scene_id: activeId,
                    url: res.url,
                    name: res.name,
                })
                dispatch(actions.addScence(endScen))
                setTimeout(() => [dispatch(actions.changeVrView(activeId))], 0)
                setIsModalVisible(false)
            })
            .catch(err => {})
    }

    // 清空参数 关闭弹窗
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    // 获取到当前高亮数据信息 展示对应的设置信息
    // 如果没有切换 则默认设置 数据中第一项为 当前展示
    const uploadBase64 = async file => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            uploadBase({
                name: file.name,
                file: reader.result,
            })
                .then(res => {
                  console.log(res, '上传返回')
                  message.success('上传完成可以继续')
                    sceneForm.setFieldsValue({ url: res.data.url })
                })
                .catch(err => {})
        }
    }

    //
    // 文件上传
    const uploadProps = {
        action: prefix,
        customRequest: file => {
            console.log(file, '---file')
            uploadBase64(file.file)
        },
        beforeUpload: file => {},
    }
    // const normFile = e => {
    //     console.log('Upload event:', e)
    //     return e && [{ url: 'e.fileList' }]
    // }

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
                    <Form form={configForm}>
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
                                <Panel header={panoramic.name} key={panoramic.uni_scene_id}>
                                    <Collapse>
                                        {panoramic.anchor_list &&
                                            panoramic.anchor_list.length &&
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
                <Form form={sceneForm} name='scene'>
                    <Form.Item label='场景名称' name='name' rules={[{ required: true }]}>
                        <Input style={{ width: 120 }} />
                    </Form.Item>
                    <Form.Item label='请上传全景图片' name='url' rules={[{ required: true }]}>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Edit
