// content action
export enum ActionType {
  EDIT = 'edit', //编辑单个页面元素
  GET = 'get', //获取元素信息
  UNION = 'union', //整合页面元素
  SCREENHOT = 'screenhot', //整合页面元素
}

export enum EditType {
  PRICE = 'price',
  IMG = 'img',
  FEE = 'fee',
  TITLE = 'title',
  BOTTOM = 'bottom',
}

export enum ScreenHotMessage {
  START = 'start-capture',
  CAPTUREPROCESS = 'capture-process',
  CAPTUREPROCESSTOBACKGROUND = 'capture-process-to-background',
  CAPTUREEND = 'capture-end',
}
