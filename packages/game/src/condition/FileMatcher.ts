import { FileInput, IFileExistenceChecker } from '../types'

interface FileExistenceInput extends FileInput {
  exists: boolean
}

export async function checkFiles(
  checker: IFileExistenceChecker,
  files: FileExistenceInput[]
) {
  const existences = await Promise.all(
    files.map((file) => checker.exists(file))
  )
  return existences.every((exists, index) => exists === files[index].exists)
}
