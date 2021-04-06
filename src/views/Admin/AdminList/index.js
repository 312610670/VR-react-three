import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Button, Table, Tag, Space, Modal, Input, Form } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons'

import { getProjects, addProject } from '../../../api/index'

const { Header, Footer, Content } = Layout
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}
const columns = [
    {
        title: '项目',
        dataIndex: 'name',
        key: 'name',
        render: text => <span>{text}</span>,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: '创建说明',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '项目状态',
        dataIndex: 'status',
        key: 'status',
        render: status => <>{status === 0 ? <Tag color={'red'}>刪除</Tag> : <Tag color={'green'}>發佈</Tag>}</>,
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size='middle'>
                <Link target='_blank' to={`/on-line/Exhibition?id=${text.id}`}>
                    查看
                </Link>
                <Link target='_blank' to={`/on-line/design?id=${text.id}`}>
                    编辑
                </Link>
                <span>删除</span>
            </Space>
        ),
    },
]

const AdminList = () => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState([])
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    // 添加数据
    const submit = data => {
        addProject(data)
            .then(res => {
                console.log(res, '--res')
                setVisible(false)
                getProjects()
            })
            .catch(err => {
                console.log(err, '--err')
            })
    }

    useEffect(() => {
        setLoading(true)
        getProjects().then(res => {
            if (res.status === true && res.error_code === 0) {
                setLoading(false)
                setData(res.data)
            }
        })
    }, [])
    return (
        <div>
            <Layout
                style={{
                    height: '100vh',
                }}
            >
                <Layout>
                    <Header className=''>
                        <Button
                            icon={<PlusSquareOutlined />}
                            onClick={() => {
                                form.resetFields()
                                setVisible(true)
                            }}
                            type='primary'
                            ghost
                            size={'large'}
                        >
                            添加
                        </Button>
                    </Header>
                    <Content style={{ padding: '40px' }}>
                        <Table columns={columns} loading={loading} dataSource={data} rowKey='id' />
                    </Content>
                    <Footer>
                        <Button>
                            <Link to={'/vr/demo'} target='_blank'>
                                房间内部放置物体
                            </Link>
                        </Button>
                        <Button>
                            <Link to={'/vr/Hexagon'} target='_blank'>
                                六边型场景图
                            </Link>
                        </Button>
                    </Footer>
                </Layout>
            </Layout>
            <Modal
                title='Modal'
                visible={visible}
                onOk={() => {
                    form.validateFields()
                        .then(res => {
                            submit(res)
                        })
                        .catch(err => {})
                }}
                onCancel={() => {
                    setVisible(false)
                }}
                okText='确认'
                cancelText='取消'
            >
                <Form
                    {...layout}
                    form={form}
                    name={'addProject'}
                    onFinish={() => {
                        console.log('提交表单且数据验证成功后回调事件')
                    }}
                    onFinishFailed={err => {
                        console.log('err', err)
                    }}
                >
                    <Form.Item label='項目名稱' name='name' rules={[{ required: true, message: '填写项目名称!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='项目描述' name='description' rules={[{ required: true, message: '请填写项目描述!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AdminList
