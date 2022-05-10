import { ActionType } from '~/actionType/PopupToConTent'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'

enum EditType {
  PRICE = 'price',
  IMG = 'img',
}

/** 页面上的订单 */
const _shopList = atom({
  key: 'shopList',
  default: [],
})
let pageInfo
const getShopList = async (setFn) => {
  !pageInfo &&
    chrome.runtime.sendMessage(
      {
        type: ActionType.GET,
        from: 'popup',
      },
      (res: { shopInfos: any; feedDetails: any }) => {
        pageInfo = res
        res?.shopInfos.map((_) => {
          _.value = Number(_.value.replace(/,/g, ''))
          return _
        })
        setFn(res)
      }
    )
  return true
}

const changeShopPage = async (index, value, type) => {
  chrome.runtime.sendMessage({
    type: ActionType.EDIT,
    from: 'popup',
    data: {
      type,
      index,
      value,
    },
  })
  return true
}

const shopListStore = () => {
  const [shopList, setShopList] = useRecoilState(_shopList)

  return {
    shopList,
    setShopList,
    getShopList,
  }
}

export { getShopList, changeShopPage }
