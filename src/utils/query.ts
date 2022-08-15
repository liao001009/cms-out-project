/** 获取查询参数 */
export const getSearchParam = (url: string, param: string) => {
  const re = new RegExp(`[\\?&]${param}=([^(&|#)]*)`, 'i')
  const arr = re.exec(url)
  if (arr === null) {
    return null
  } else {
    return decodeURIComponent(arr[1])
  }
}

/** 设置查询参数 */
export const setSearchParam = (
  url: string,
  param: string,
  value: string | null
) => {
  const reg = new RegExp('([\\?&]' + param + '=)[^&]*', 'i')
  if (value == null) {
    if (reg.test(url)) {
      url = url.replace(reg, '')
    }
  } else {
    value = encodeURIComponent(value)
    if (reg.test(url)) {
      url = url.replace(reg, RegExp.$1 + value)
    } else {
      url += (url.indexOf('?') === -1 ? '?' : '&') + param + '=' + value
    }
  }
  if (url.charAt(url.length - 1) === '?') {
    url = url.substring(0, url.length - 1)
  }
  return url
}
