var baseSlice = require('./baseSlice.js')
// 当符合predicate条件的时候，所有在某一侧满足条件的元素都会被抛弃
function baseWhile(array, predicate, isDrop, fromRight) {
  const { length } = array
  let index = fromRight ? length : -1

  // 针对元素进行判断，找到需要抛弃的所有元素的最后一个的index
  while((fromRight ? index-- : ++index < length) &&
    predicate(array[index], index, array)) {}

  // 返回抛弃元素后的数组
  return isDrop
    ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
    : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index))
}

var a = [
  { name: "Lucas", active: true},
  { name: "Eliane", active: false},
  { name: "Jobs", active: false},
  { name: "WTF", active: true}
]

// 下面的操作不会抛弃任何一个元素，因为第一个元素就不符合情况

console.log(baseWhile(a, function(o) {return o.active;}, true, true))
