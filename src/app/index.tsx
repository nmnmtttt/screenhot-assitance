import React from 'react'
import { render } from 'react-dom'
import Main from './mian'
import './index.less'
import { RecoilRoot } from 'recoil'
import { ConfigProvider } from 'antd'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN'

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <RecoilRoot>
        <Main></Main>
      </RecoilRoot>
    </ConfigProvider>
  )
}

render(<App />, document.querySelector('#app'))
