import type { IFileCondition } from '@linux-odyssey/models'

const fileTypes = new Map([
  ['file', '-f'],
  ['folder', '-d'],
  ['link', '-L'],
  ['socket', '-S'],
])

function sanitizePath(path: string): string {
  return path.replace(/[^a-zA-Z0-9._/-]/g, '')
}

export function buildFileCheckCmd(file: IFileCondition): string[] {
  const { path, type } = file
  return ['test', fileTypes.get(type) || '-e', sanitizePath(path)]
}
