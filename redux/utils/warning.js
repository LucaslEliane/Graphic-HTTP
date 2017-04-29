
/**
 * 一个默认的警告打印函数，这个函数使用console.error打印警告，并且抛出错误来让程序终止
 * 
 * @export
 * @param {any} message 错误消息
 */
export default function warning(message) {
  // 这里要注意，一个未经定义的变量，其typeof的值为 'undefined'字符串，而不是 undefined
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }
  // 抛出一个不进行处理的error，来终止程序
  try {
    throw new Error(message)
  } catch (e) {}
}