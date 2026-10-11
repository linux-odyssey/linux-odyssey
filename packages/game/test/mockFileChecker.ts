import type { IFileExistenceChecker, IFileInput } from '../schema'

export class MockFileChecker implements IFileExistenceChecker {
  private files: IFileInput[] = [
    {
      path: '/home/user/hello.txt',
      type: 'file',
    },
    {
      path: '/home/user/world.txt',
      type: 'file',
    },
    {
      path: '/home/user/Downloads',
      type: 'directory',
    },
  ]

  async exists(file: IFileInput): Promise<boolean> {
    return this.files.some((f) => f.path === file.path && f.type === file.type)
  }
}
