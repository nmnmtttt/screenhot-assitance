import { Input, PageHeader, Avatar, Upload, Row, Col } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { getShopList, changeShopPage } from '../../store/shopList'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { EditType } from '~/actionType/PopupToConTent'

const headDetailList: React.FC<any> = () => {
  const [titleList, setTitleList] = useState([])

  useEffect(() => {
    getShopList((res) => setTitleList(res.headDetails))
  }, [])
  const changeTitle = async (target, index) => {
    setTitleList((e) => {
      const arr = [...e]
      arr[index].value = target.target.value
      return arr
    })
  }

  return (
    <div style={{ height: '12%' }}>
      <PageHeader className="site-page-header" title="订单头" subTitle="订单头部的信息明细" />
      <Row style={{ width: '100%', alignItems: 'center' }} className={'main-warp'}>
        {titleList?.map((_, index) => (
          <Fragment>
            <Col span={2} style={{ textAlign: 'right' }}>
              {_.title + '：'}
            </Col>
            <Col span={4}>
              <Input
                style={{ width: '95%' }}
                key={index.toString(36)}
                value={_.value}
                onChange={(e) => {
                  changeTitle(e, index)
                }}
                onBlur={(e) => {
                  changeShopPage(index, titleList[index].value, EditType.TITLE)
                }}
              />
            </Col>
          </Fragment>
        ))}
      </Row>
    </div>
  )
}

export default headDetailList
