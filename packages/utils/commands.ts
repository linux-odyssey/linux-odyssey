export interface File {
  path: string
  type: string
}

const fileTypes = new Map([
  ['file', '-f'],
  ['directory', '-d'],
  ['link', '-L'],
  ['socket', '-S'],
])

function sanitizePath(path: string): string {
  return path.replace(/[^a-zA-Z0-9._/-]/g, '')
}

export function buildFileCheckCmd(file: File): string[] {
  const { path, type } = file
  return ['test', fileTypes.get(type) || '-e', sanitizePath(path)]
}
