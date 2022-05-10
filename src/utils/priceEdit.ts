export const forMatPrice = (value) => {
  const arr = []

  Array.from(value + '').reverse().map((_, index) => { if (index && !(index % 3)) arr.push(','); arr.push(_ + '') })
  return arr.reverse().join('')
}
