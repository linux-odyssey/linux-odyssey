const fileTypes = {
  file: '-f',
  folder: '-d',
  link: '-L',
  socket: '-S',
  unknown: '-e',
}

export type FileType = keyof typeof fileTypes

export type File = {
  path: string
  type: FileType
}

function sanitizePath(path: string): string {
  return path.replace(/[^a-zA-Z0-9._/-]/g, '')
}

export function buildFileCheckCmd(file: File): string[] {
  const { path, type } = file
  return ['test', fileTypes[type] || '-e', sanitizePath(path)]
}
