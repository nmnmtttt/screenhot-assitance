import React, { useState } from 'react'
import { Layout, Menu, Row, Col, Button } from 'antd'
import ShopList from '../components/shopList'
import FeedDetailList from '../components/feedDetailList'
import BottomDetailList from '../components/bottomDetailList'
import HeadDetailList from '../components/headDetailList'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { ScreenHotMessage } from '~/actionType/PopupToConTent'
import { dataURItoBlob, exportBlob } from '~/utils/blobAct'

const main: React.FC<any> = () => {
  const [isCapture, setIsCapture] = useState(false)
  const [file, setFile] = useState('')
  const [host, setHost] = useState('')
  const startCapture = () => {
    setIsCapture(true)
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const tab = tabs[0]
      chrome.tabs.sendMessage(tab.id, { type: ScreenHotMessage.START })
    })
    chrome.runtime.onMessage.addListener((data, sender) => {
      if (data.action === ScreenHotMessage.CAPTUREEND) {
        setIsCapture(false)
        setFile(data.data?.imgBlob)
        setHost(data.data?.host)
      }
    })
  }
  const exportFile = () => {
    const blob = dataURItoBlob(file)
    exportBlob(blob, host + '-截图-' + new Date().getTime() + '.png')
  }
  return (
    <Layout style={{ height: '160px', display: 'flex', padding: '25px', justifyContent: 'space-around' }}>
      <Button disabled={isCapture} onClick={startCapture}>
        截图
      </Button>
      <Button disabled={!Boolean(file)} onClick={exportFile}>
        导出截图
      </Button>
    </Layout>
  )
}

export default main
