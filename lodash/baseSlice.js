function baseSlice(array, start, end) {
  let index = -1
  // 将传入的参数数组的长度直接进行赋值
  let { length } = array

  if (start < 0) {
    start = -start > length ? 0 : (length + start)
  }
  end = end > length ? length : end
  if (end < 0) {
    end += length
  }
  // >>> 0 是将所有非数值转换为0，所有大于等于0的数取整数部分
  length = start > end ? 0 : ((end - start) >>> 0)
  start >>>= 0

  const result = new Array(length)
  while(++index < length) {
    result[index] = array[index + start]
  }
  return result
}

module.exports = baseSlice
