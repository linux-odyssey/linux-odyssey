export function dirname(path) {
  const parts = path.split('/')
  if (parts.length <= 2) {
    return '/'
  }
  parts.pop()
  return parts.join('/')
}

export function basename(path) {
  const parts = path.split('/')
  return parts.pop()
}
