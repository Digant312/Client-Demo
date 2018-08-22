export const removeTrailingSlash = (str: string) => {
  if (str.substr(str.length - 1) === '/') {
    return str.substr(0, str.length - 1)
  }
  return str
}