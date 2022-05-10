export const Timer = {
  sleep: (t: number) => {
    return new Promise((res) => {
      setTimeout(res, t)
    })
  },
}
