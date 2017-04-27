

function isArguments(value) {
  return typeof value == 'object' && value != null
}

function isFlattenable(value) {
  return Array.isArray(value) || isArguments(value) || !!(Symbol.isConcatSpreadable && value && value[Symbol.isConcatSpreadable])
}
/*
    将一个类数组对象或者数组进行扁平化，去掉数组的层次，变成一个一维数组
*/
function baseFlatten(array, depth, predicate, isStrict, result) {
  // 使用传入的递归结束条件，如果没有传入，则使用默认的条件
  predicate || (predicate = isFlattenable)
  result || (result = [])

  if (array == null) {
    return result
  }

  for (const value of array) {
    // 如果到达了遍历深度，或者是不满足递归条件了，则退出
    if (depth > 0 && predicate(value)) {
      // 如果深度仍然大于1，则继续递归
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result)
      } else {
        // 否则，直接将内容输入数组，这个数组则是该部分被扁平化以后的结果
        result.push(...value)
      }
    } else if (!isStrict) {
      // 将扁平化的结果输入数组
      result[result.length] = value
    }
  }
  return result
}

var a = [1,2,3,[1,2,[2,1,[1,2]]]];

console.log(baseFlatten(a, 10))  // [1,2,3,1,2,2,1,1,2]
