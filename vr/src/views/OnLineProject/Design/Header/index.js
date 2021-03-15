import React, { useMemo } from 'react'
import { Button, Row, Col, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, useParams, useLocation } from 'react-router-dom'
import qs from 'qs'

import {
    // selectIsHotspot,
    // selectIsDelete,
    // selectActiveId,
    selectPanoramicData,
    // selectAutoRotate,
} from '../reselect'

import { addscene } from '../../../../api/index'

const Header = () => {
    const history = useHistory()

    const location = useLocation()
    const panoramicData = useSelector(selectPanoramicData()) // 项目数据
    const query = useMemo(() => {
        return qs.parse(location.search.slice(1))
    }, [location.search])

    const release = () => {
        console.log(query)
        const params = {
            project_id: query.id,
            scene_list: panoramicData,
        }
        addscene(params).then(res => {
            console.log(res, '提交返回结果')
            if (res.status) {
                message.success('提交成功', () => {
                    history.push('/admin')
                })
            }
        })
        console.log(panoramicData, '--panoramicData')
    }

    return (
        <Row justify='end'>
            <Col span={4}>
                <Button
                    type='primary'
                    onClick={() => {
                        release()
                    }}
                >
                    发布
                </Button>
                <Button>
                    <Link to='/view'>预览</Link>
                </Button>
            </Col>
        </Row>
    )
}

export default Header
