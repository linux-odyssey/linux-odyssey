export function dirname(path) {
  const parts = path.split('/')
  parts.pop()
  return parts.join('/')
}

export function basename(path) {
  const parts = path.split('/')
  return parts.pop()
}
