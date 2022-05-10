export function dataURItoBlob(dataURI: string) {
  try {
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0] // mime类型
    const byteString = atob(dataURI.split(',')[1]) //base64 解码
    const arrayBuffer = new ArrayBuffer(byteString.length) //创建缓冲数组
    const intArray = new Uint8Array(arrayBuffer) //创建视图

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i)
    }
    return new Blob([intArray], { type: mimeString })
  } catch (err) {
    return null
  }
}

export function exportBlob(blob: Blob, fname: string) {
  const download = document.createElement('a')
  download.download = fname
  download.href = window.URL.createObjectURL(blob)
  download.style.display = 'none'
  download.onclick = function () {
    document.body.removeChild(download)
  }
  document.body.appendChild(download)

  download.click()
}
