/**
 * 针对服务器端渲染的时候，URL的location对象进行格式化的解析
 * @param {*} object 
 */
const normalizeLocation = (object) => {
  const { pathname = '/', search = '', hash = '' } = object

  return {
    pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  }
}

/**
 * 为路由的location添加根目录的地址，返回一个新的location对象
 * @param {*} basename 
 * @param {*} location 
 */
const addBasename = (basename, location) => {
  if (!basename)
    return location
  return {
    ...location,
    pathname: addLeadingSlash(basename) + location.pathname
  }
}