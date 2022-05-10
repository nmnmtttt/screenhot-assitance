import { Input, PageHeader, Avatar, Upload } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { getShopList, changeShopPage } from '../../store/shopList'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { EditType } from '~/actionType/PopupToConTent'

const shopList: React.FC<any> = () => {
  const [detailList, setDetailList] = useState([])

  useEffect(() => {
    getShopList((res) => setDetailList(res.feedDetails))
  }, [])
  const changeDetail = async (target, index) => {
    setDetailList((e) => {
      const arr = [...e]
      arr[index].value = target.target.value
      return arr
    })
  }

  return (
    <Fragment>
      <PageHeader className="site-page-header" title="费用明细" subTitle="费用明细中的项" />
      <div style={{ height: '90%', overflow: 'auto' }}>
        {detailList?.map((_, index) => (
          <div className="shopItem" key={index.toString(36)}>
            <em style={{ width: '40%' }}>{_.title}</em>
            <Input
              style={{ width: '400px' }}
              key={index.toString(36)}
              value={_.value}
              onChange={(e) => {
                changeDetail(e, index)
              }}
              onBlur={(e) => {
                changeShopPage(index, detailList[index].value, EditType.FEE)
              }}
            />
          </div>
        ))}
      </div>
    </Fragment>
  )
}

export default shopList
