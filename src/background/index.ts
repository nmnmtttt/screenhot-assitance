import { ActionType, ScreenHotMessage } from '~/actionType/PopupToConTent'
import { Timer } from '~/utils/timer'

// 默认点击打开
enum From {
  CONTENT = 'content',
  POPUP = 'popup',
}
async function captureVisibleTab(sender) {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab(sender?.tab?.windowId || sender?.id, { format: 'png' }, (dataUrl) => {
      resolve(dataUrl)
    })
  })
}

function blobToDataURI(blob: Blob): Promise<string> {
  return new Promise((res) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function (e) {
      res(e.target.result as string)
    }
    reader.onerror = () => {
      res(null)
    }
  })
}

const canvas = document.createElement('canvas'),
  context = canvas.getContext('2d')
const windowInfo = {
  windowId: 0,
  tabsId: 0,
  popupId: 0,
}

const postMessage = async (tabId, message) =>
  new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (res) => {
      if (!chrome.runtime.lastError) resolve(res)
    })
  })

const listener = async (message: any, sender: chrome.runtime.MessageSender, sendResponse: (Response: any) => void) => {
  switch (message.action as ScreenHotMessage) {
    case ScreenHotMessage.CAPTUREPROCESSTOBACKGROUND:
      if (message?.data?.url) {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        img.onload = () => {
          document.body.appendChild(img)
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
          context.canvas.toBlob(async (blob) => {
            await postMessage(sender.tab.id, {
              type: ScreenHotMessage.CAPTUREEND,
              data: {
                url: await blobToDataURI(blob),
              },
            })
          })
        }

        img.src = message?.data?.url
      } else {
        try {
          const dataUrl = await captureVisibleTab(sender)
          postMessage(sender.tab.id, {
            type: ScreenHotMessage.CAPTUREPROCESS,
            data: {
              dataUrl,
              x: message?.data?.x,
              y: message?.data?.y,
            },
          })
        } catch (error) {
          postMessage(sender.tab.id, {
            type: ScreenHotMessage.CAPTUREPROCESS,
            data: {
              dataUrl: undefined,
              x: message?.data?.x,
              y: message?.data?.y,
            },
          })
        }
      }
      return true
  }
}

chrome.runtime.onMessageExternal.addListener(
  (message: any, sender: chrome.runtime.MessageSender, sendResponse: (Response: any) => void) =>
    listener(message, sender, sendResponse)
)

chrome.runtime.onMessage.addListener(
  (message: any, sender: chrome.runtime.MessageSender, sendResponse: (Response: any) => void) =>
    listener(message, sender, sendResponse)
)
