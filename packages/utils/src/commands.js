const fileTypes = {
  file: '-f',
  folder: '-d',
  link: '-L',
  socket: '-S',
}

function sanitizePath(path) {
  return path.replace(/[^a-zA-Z0-9._/-]/g, '')
}

// eslint-disable-next-line import/prefer-default-export
export function buildFileCheckCmd(file) {
  const { path, type } = file
  return ['test', fileTypes[type] || '-e', sanitizePath(path)]
}
