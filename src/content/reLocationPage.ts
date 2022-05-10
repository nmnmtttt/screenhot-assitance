import { Timer } from '~/utils/timer'
//递归检查是否被包在除了body外的特殊定位元素中
const includeInSpecialEL = (el: HTMLElement) => {
  const { scrollHeight: viewHeight } = document.documentElement
  const { scrollHeight: elHeight } = el
  if (el.localName === 'body') return false
  // 是特殊布局并且大小不是和body相同 -说明不是用body来定位布局的
  if (['relative', 'absolute', 'fixed', 'sticky'].includes(getComputedStyle(el).position) && viewHeight !== elHeight)
    return true
  return includeInSpecialEL(el.parentElement)
}
// TODO: 那种不靠body滚动的 只有中间一部分内部在滚动的要想办法整一下 能不能先把所有的活动都设置成可见来做？
// 那种无限滚动的也要想个办法,或者对无限滚动的截屏有意义吗？
// 创造虚拟body大小的画布-嵌入页面上-content环境使用
export const createVituralBody = () => {
  if (!document.body) throw new Error('请在有视图的环境下使用该方法')
  const vituralDiv = document.createElement('div')
  vituralDiv.style.position = 'absolute'
  vituralDiv.style.top = '0'
  vituralDiv.style.width = document.body.scrollWidth + 'px'
  vituralDiv.style.height = document.documentElement.scrollHeight + 'px'
  vituralDiv.style.overflow = 'hidden' //避免出现一些奇怪的布局把屏幕拉长 比如非常高但是看起来只有一点点的元素
  document.body.appendChild(vituralDiv)
  return vituralDiv
}

//修改内部是滑动的元素 把它拉长 让它们可以完整展示
export const editScrollElement = () => {
  const editRecords: { el: HTMLElement; attr: string; orgin: string }[] = [] // 记录下改了啥
  // 如果body隐藏滑轮 展示
  if (getComputedStyle(document.body).overflowY === 'hidden') {
    // 变更记录
    editRecords.push({
      el: document.body,
      attr: 'overflowY',
      orgin: document.body.style.overflowY || '',
    })
    document.body.style.overflowY = 'auto'
  }

  // 获取所有属性是滑动 并且滑动的高度比实际高度高的
  const scorllEls = Array.from(document.querySelectorAll('*'))
    .filter((_) => getComputedStyle(_).overflow === 'auto')
    .filter((_: HTMLElement) => _.scrollHeight > _.offsetHeight)
  scorllEls.map((_: HTMLElement) => {
    //修改高度-把元素拉大
    editRecords.push({
      el: _,
      attr: 'minHeight',
      orgin: _.style.minHeight || '',
    })
    _.style.minHeight = _.scrollHeight + 'px'
  })

  //修改高度-把父级全部调整成auto
  const changeHeightUntilBody = (el: HTMLElement) => {
    if (el.localName === 'body') return
    if (!editRecords.find((_) => _.el === el)) {
      // 改过就不改了
      editRecords.push({
        el: el,
        attr: 'height',
        orgin: el.style.height || '',
      })
      el.style.height = 'auto'
    }
    changeHeightUntilBody(el.parentElement)
  }
  scorllEls.map((_: HTMLElement) => changeHeightUntilBody(_.parentElement))
  return { editRecords }
}

// 将定位为fix 或者 stick的在画布上重新定位 防止截图时跟着滚动
export const reLocationFixedOrStikyEl = async (bodyEl: HTMLDivElement) => {
  // 出现的await都是为了等页面渲染完毕
  // 获取fix 或者 stick的节点

  const getStickOrFixedNode = () =>
    Array.from(document.querySelectorAll('*'))
      .filter((element) => {
        const css = window.getComputedStyle(element)
        if (css.position.match(/fixed|sticky/gi)) return element
      })
      .filter((element) => {
        // 有大小的才有布局意义
        const rect = element.getBoundingClientRect()
        return rect.bottom > 0 || rect.top > 0
      })
  const copyFloatEls = []
  // 刚开始还没滑动就有的元素
  const originFloatEls = getStickOrFixedNode()
  //还没开始滑滑动就是固定在页面上的元素的位置记录
  const originFloatNodesIdx = originFloatEls.length
  const height = +getComputedStyle(bodyEl).height.replace('px', '')
  let step = 8
  let starYPositon = 0
  // 滑动截取每部分 挑出那些滑动以后才会fixed的元素
  while (step) {
    window.scroll(0, (starYPositon += height / 10))
    await Timer.sleep(1)
    originFloatEls.push(...getStickOrFixedNode().filter((_) => originFloatEls.indexOf(_) === -1))
    step--
  }
  // 滑动回顶部
  window.scroll(0, 0)
  await Timer.sleep(1000)

  console.log(
    originFloatEls.filter((_: HTMLElement) =>
      //fixed 直接相对页面定位 sticky看父元素的情况
      getComputedStyle(_).position === 'fixed' ? true : !includeInSpecialEL(_.parentElement)
    )
  )
  const opacityRecords = []
  originFloatEls
    .filter((_: HTMLElement) =>
      getComputedStyle(_).visibility !== 'hidden' &&
      //fixed 直接相对页面定位 sticky看父元素的情况
      getComputedStyle(_).position === 'fixed'
        ? true
        : !includeInSpecialEL(_.parentElement)
    )
    .map((_: HTMLElement, index) => {
      // 没滑动就固定在页面上的 直接用人家自己原来的属性就行
      let copyEl = _.cloneNode(true) as HTMLElement

      // TODO: 试试看用class效果会不会好一点
      // style复制法
      const copyStyle = (origin: HTMLElement, _copyEl: HTMLElement) => {
        // 完全复制初始的形态 避免滑动时产生变化-子节点也复制出来
        const styleCopy = getComputedStyle(origin)
        const copyElChildren = _copyEl.children
        Array.from(styleCopy).map((styleAttr) => {
          if (styleCopy[styleAttr]) _copyEl.style[styleAttr] = styleCopy[styleAttr]
        })
        Array.from(origin.children).map((_: HTMLElement, index) => copyStyle(_, copyElChildren[index] as HTMLElement))
        //让滑动可见
        _copyEl.style.overflow = 'visible'
      }
      //清空id
      copyEl.id = ''
      //清空class
      copyEl.className = ''
      //复制形态
      copyStyle(_, copyEl)

      if (index >= originFloatNodesIdx) {
        //创造外部Div包裹内部元素-方便控制
        const outerDiv = document.createElement('div')
        const { top, left } = _.getBoundingClientRect()
        // 如果是滑动中才出现的 位置根据页面初始位置决定
        outerDiv.style.left = left + 'px'
        outerDiv.style.top = top + 'px'
        copyEl.style.position = 'initial'
        outerDiv.appendChild(copyEl)
        // 替换原来的元素
        copyEl = outerDiv
      } else {
        // 原来就有 根据距离顶部和顶部的大小来相对布局 或者用百分比布局会更好？
        const { left } = _.getBoundingClientRect()
        const { top, bottom } = getComputedStyle(_)
        const topNumber = +top.replace('px', '')
        const bottomNumber = +bottom.replace('px', '')
        if (topNumber > bottomNumber) copyEl.style.top = 'unset'
        else copyEl.style.bottom = 'unset'
        copyEl.style.left = left + 'px'
      }
      copyEl.style.position = 'absolute'
      // 透明度记录
      opacityRecords.push({ el: _, originOpacity: _.style.opacity })
      _.style.opacity = '0' //原来的弄成透明的 反正fixed和stick也不影响布局;
      copyFloatEls.push(copyEl)
    })
  console.log(opacityRecords)

  await Timer.sleep(1)
  return { newNodes: copyFloatEls, originNodes: originFloatEls, opacityRecords }
}

export const reLocationPage = async () => {
  const { editRecords } = editScrollElement()
  const vituralDiv = createVituralBody()
  const { newNodes, originNodes, opacityRecords } = await reLocationFixedOrStikyEl(vituralDiv)
  newNodes.map((_) => vituralDiv.appendChild(_))
  // 还原所有更改
  const clearNewNode = () => {
    editRecords.map((_) => {
      // 还原元素
      _.el.style[_.attr] = _.orgin
    })
    vituralDiv?.remove()
    originNodes.map((_: HTMLElement) => {
      // 原来的元素
      const orginNodeInfo = opacityRecords.find((record) => _.isSameNode(record.el))
      // 原来的透明度还原
      const originOpacity = orginNodeInfo?.originOpacity
      // 如果原来的元素还存在
      if (orginNodeInfo) {
        if (originOpacity) _.style.opacity = originOpacity
        _.style.opacity = ''
      }
    })
  }
  return { clearNewNode }
}
