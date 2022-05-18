// @elements组件定义，防止引用未发布组件报错
declare module '@elements/*' {
  const value: any
  export default value
}

// 静态资源定义
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.json' {
  const value: any
  export default value
}
