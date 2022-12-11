export const formatDate = (numb, format) => {
  const old = numb - 1
  const t = Math.round((old - Math.floor(old)) * 24 * 60 * 60)
  const time = new Date(1900, 0, old, 0, 0, t)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const hours = time.getHours()
  const minutes = time.getMinutes()
  return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date) + ' ' + hours + ':' + minutes
}



export const removalData = (data) => {
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      if (data[i].value === data[j].value) {
        data.splice(j, 1)
        j--
      }
    }
  }
  return data
}