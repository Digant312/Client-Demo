
// Convert an n-nested object into a flat object.
export const flattenMessages = (nestedMessages: any, prefix = '') => {
  return Object.keys(nestedMessages).reduce((messages: any, key: string) => {
    let value = nestedMessages[key]
    let prefixedKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      messages[prefixedKey] = value
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey))
    }
    return messages
  }, {})
}