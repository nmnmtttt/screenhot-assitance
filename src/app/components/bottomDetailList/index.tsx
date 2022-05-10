import { Input, PageHeader, Avatar, Upload, Row, Col } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { getShopList, changeShopPage } from '../../store/shopList'
import { EditType } from '~/actionType/PopupToConTent'

const bottombottomDetailsList: React.FC<any> = () => {
  const [bottomDetailsList, setBottomDetailsList] = useState([])

  useEffect(() => {
    getShopList((res) => setBottomDetailsList(res.bottomDetails))
  }, [])
  const changeTitle = async (target, index) => {
    setBottomDetailsList((e) => {
      const arr = [...e]
      arr[index].value = target.target.value
      return arr
    })
  }

  return (
    <div style={{ height: '12%' }}>
      <PageHeader className="site-page-header" title="订单总和" subTitle="订单底部的信息明细" />
      <Row style={{ width: '100%' }}>
        {bottomDetailsList?.map((_, index) => (
          <Fragment>
            <Col span={2} style={{ textAlign: 'right' }}>
              {_.title + '：'}
            </Col>
            <Col span={6}>
              <Input
                key={index.toString(36)}
                value={_.value}
                onChange={(e) => {
                  changeTitle(e, index)
                }}
                onBlur={(e) => {
                  changeShopPage(index, bottomDetailsList[index].value, EditType.BOTTOM)
                }}
              />
            </Col>
            <Col span={2} />
          </Fragment>
        ))}
      </Row>
    </div>
  )
}

export default bottombottomDetailsList
