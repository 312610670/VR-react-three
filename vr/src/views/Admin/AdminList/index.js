import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import { Layout, Button, Table, Tag, Space, Modal, Input, Form } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons'

import  {getProjects} from '../../../api/index'

const { Header, Footer, Sider, Content } = Layout
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
}
const columns = [
    {
        title: '项目',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
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
        render: status => (
            <>{status === 0 ? <Tag color={'red'}>刪除</Tag> : <Tag color={'green'}>發佈</Tag>}</>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size='middle'>
                <a>查看</a>
               <Link to ={ `/on-line/design?id=${text.id}`}>编辑</Link>
                <a>删除</a>
            </Space>
        ),
    },
]

const AdminList = () => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState([]);
  useEffect(() => {
    getProjects().then(res => {
      if (res.status === 0 && res.error_code === 0) {
        console.log(JSON.stringify(res.data))
        setData(res.data)
        // return res.data
      }
    })
  }, [])
    return (
        <div>
            <Layout>
                <Sider>左边栏啊 啊啊</Sider>
                <Layout>
                    <Header className=''>
                        <Button
                            icon={<PlusSquareOutlined />}
                            onClick={() => {
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
                        <Table columns={columns} dataSource={data} rowKey='id' />
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
            <Modal
                title='Modal'
                visible={visible}
                onOk={() => {
                    setVisible(false)
                }}
                onCancel={() => {
                    setVisible(false)
                }}
                okText='确认'
                cancelText='取消'
            >
                <Form
                    {...layout}
                    name='basic'
                    onFinish={() => {
                        console.log('onFinish')
                    }}
                    onFinishFailed={console.log('onFinishFailed')}
                >
                    <Form.Item
                        label='項目名稱'
                        name='name'
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='项目描述'
                        name='description'
                        rules={[{ required: true, message: 'Please input your description!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AdminList
