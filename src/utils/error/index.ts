export const parseError = (e: any) => {
  if (e.response && e.response.body && e.response.body.Message) {
    return `${e.response.body.Message}`
  }
  if (e.message) {
    return `${e.message}`
  }
  return null
}
