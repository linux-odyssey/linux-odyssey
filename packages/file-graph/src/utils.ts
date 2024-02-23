export function dirname(path: string) {
  const parts = path.split('/')
  if (parts.length <= 2) {
    return '/'
  }
  parts.pop()
  return parts.join('/')
}

export function basename(path: string): string {
  const parts = path.split('/')
  return parts.pop() ?? ''
}
