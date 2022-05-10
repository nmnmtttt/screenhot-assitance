/**
 *@description 选取指定下标以后的元素 默认为1
 *@author lsh
 *@param
 *@date 2021-11-12
 */
export const chooseElemetAfterIndex = (arr, index = 1) => Array.from(arr).slice(index)
