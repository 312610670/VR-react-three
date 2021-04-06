import React from 'react'
import { Button,Row, Col, } from 'antd'
import {  Link } from 'react-router-dom';

const Header = () => {
    return (
        <Row justify='end'>
            
            <Col span={4}>
                <Button type='primary'>发布</Button>
                <Button >
                <Link to="/view">预览</Link></Button>
            </Col>
        </Row>
    )
}

export default Header
