import { reLocationPage } from './reLocationPage'
import { Timer } from '~/utils/timer'
import { ScreenHotMessage } from './../actionType/PopupToConTent'

const initial_position = {
  x: document.scrollingElement?.scrollLeft,
  y: document.scrollingElement?.scrollTop,
}

function getScrollbarWidth() {
  if (document.body.scrollHeight < window.innerHeight) return 0

  const scrollDiv = document.createElement('div')
  scrollDiv.className = 'scrollbar-measure'
  document.body.appendChild(scrollDiv)

  let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth

  if (scrollbarWidth === 0) scrollbarWidth = 17
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

export let imgBlob = null

async function drawIMGFrame(dataUrl, messageX, messageY) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = function () {
      context.drawImage(img, messageX, messageY)
      resolve(1)
    }
    img.src = dataUrl
  })
}

const alteredElements = []

// 滑动块的高和宽度
let ScrollbarWidth
let ScrollbarHeight

// 获取滑块高
function getScrollbarHeight() {
  if (document.body.offsetWidth === document.body.scrollWidth) return 0

  let scrollbarHeight = window.innerHeight - document.firstElementChild.clientHeight
  if (scrollbarHeight === 0) scrollbarHeight = 17
  return scrollbarHeight
}

const canvas = document.createElement('canvas'),
  context = canvas.getContext('2d')

const postMessage = async (data, cb?) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        action: data?.action,
        data: data?.data,
        status: data?.status,
      },
      (res) => {
        if (!chrome.runtime.lastError) typeof cb === 'function' && cb(resolve(res))
      }
    )
  })
}
let clearNewNode
let popupId
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type as ScreenHotMessage) {
    case ScreenHotMessage.START:
      //记录下发消息来得地方
      popupId = sender.id
      //虚拟的画布 和原来的节点
      clearNewNode = await (await reLocationPage()).clearNewNode
      ScrollbarWidth = getScrollbarWidth() // 开始的时候获取高度和宽度
      ScrollbarHeight = getScrollbarHeight() // 开始的时候获取高度和宽度
      // 高度根据滑块决定
      canvas.width = window.devicePixelRatio * document.scrollingElement.scrollWidth
      canvas.height = window.devicePixelRatio * document.scrollingElement.scrollHeight

      window.scrollTo(0, 0)
      await Timer.sleep(20)
      const pData = {
        action: ScreenHotMessage.CAPTUREPROCESSTOBACKGROUND,
        data: {
          x: 0,
          y: 0,
          canvasW: context.canvas.width,
          canvasH: context.canvas.height,
        },
      }
      postMessage(pData)
      break
    case ScreenHotMessage.CAPTUREPROCESS:
      alteredElements.push({
        element: document.documentElement,
        style: {
          transform: document.documentElement.style.transform,
        },
      })

      alteredElements.push({
        element: document.body,
        style: { overflow: document.body.style.overflow },
      })

      console.log('catch')
      await Timer.sleep(500)
      await drawIMGFrame(message?.data?.dataUrl, message?.data?.x, message?.data?.y)
      await Timer.sleep(20)

      let x = document.scrollingElement.scrollLeft
      let y = document.scrollingElement.scrollTop
      const scrollHeight = document.scrollingElement.scrollHeight
      const scrollWidth = document.scrollingElement.scrollWidth

      const width = window.innerWidth
      const height = window.innerHeight
      if (x + width + 1 < scrollWidth) {
        // 是否可以结束 1px误差
        // x轴滑动-y位置要去掉滚轴宽不然会截进去
        x += width - ScrollbarWidth
        if (x > scrollWidth - width) {
          x = scrollWidth - width + ScrollbarWidth
        }
        window.scrollTo(x, y)
        await Timer.sleep(100)
        await postMessage({
          action: ScreenHotMessage.CAPTUREPROCESSTOBACKGROUND,
          data: {
            x: window.devicePixelRatio * x,
            y: window.devicePixelRatio * y,
            canvasW: context.canvas.width,
            canvasH: context.canvas.height,
          },
        })
      } else if (y + height + 1 < scrollHeight) {
        x = initial_position.x // x轴回到原始位置
        // 是否可以结束 1px误差
        // y轴滑动-y位置要去掉滚轴高不然回截进去
        y += height - ScrollbarHeight
        if (y > scrollHeight - height) {
          y = scrollHeight - height + ScrollbarHeight
        }
        window.scrollTo(x, y)
        await Timer.sleep(100)
        await postMessage({
          action: ScreenHotMessage.CAPTUREPROCESSTOBACKGROUND,
          data: {
            x: window.devicePixelRatio * x,
            y: window.devicePixelRatio * y,
            canvasW: context.canvas.width,
            canvasH: context.canvas.height,
          },
        })
      } else {
        // 滑动加载完毕 返回初始位置
        window.scrollTo(initial_position.x, initial_position.y)
        context.canvas.toBlob(async (blob) => {
          const url = window.URL.createObjectURL(blob)
          let state
          // 返回 初始状态
          while ((state = alteredElements.pop())) {
            for (const property in state.style) {
              state.element.style.setProperty(property, state.style[property], 'important')
            }
          }
          await Timer.sleep(1500)
          // 发消图片回去 主要靠这个url来标识这个消息是不是结束 action都是一样的
          await postMessage({
            action: ScreenHotMessage.CAPTUREPROCESSTOBACKGROUND,
            data: {
              url,
              host: window.location.host,
            },
          })
        })
      }
      break
    case ScreenHotMessage.CAPTUREEND:
      imgBlob = message?.data?.url
      clearNewNode?.()
      clearNewNode = undefined
      // 发回去
      postMessage({
        action: ScreenHotMessage.CAPTUREEND,
        data: { imgBlob, host: window.location.host },
      })
      break
  }
  return true
})
