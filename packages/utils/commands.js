const fileTypes = {
  file: '-f',
  folder: '-d',
  link: '-L',
  socket: '-S',
}

// eslint-disable-next-line import/prefer-default-export
export function buildFileCheckCmd(files) {
  return files
    .map(
      ({ path, type, exists }) =>
        `${exists ? '' : '! '}test ${fileTypes[type] || '-e'} ${path}`
    )
    .join(' && ')
}
