export const imgUrlFormat = url => {
  if (/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
    return url
  }
  return process.env.API_ROOT + url
}
