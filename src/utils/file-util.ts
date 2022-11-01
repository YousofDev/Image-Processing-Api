import { promises } from 'fs'
import path from 'path'

export const originalPath = path.resolve(__dirname, '../../assets/original')
export const resizedPath = path.resolve(__dirname, '../../assets/resized')

interface FileProperties {
  filename: string
  width?: number
  height?: number
}

export const original = (filename: string) => {
  return path.resolve(originalPath, `${filename}.jpg`)
}

export const resized = (filename: string, height: number, width: number) => {
  return path.resolve(resizedPath, `${filename}-${width}x${height}.jpg`)
}

export const accessFilePath = async (
  image: FileProperties
): Promise<null | string> => {
  let accessPath: string

  if (image.height && image.width) {
    // the path if we already have resized image
    accessPath = resized(image.filename, image.height, image.width)
  } else {
    // or the path for original image
    accessPath = original(image.filename)
  }

  try {
    // Check The Real File Path
    await promises.access(accessPath)
    return accessPath
  } catch {
    return null
  }
}

export const availableFileNames = async (): Promise<string[]> => {
  // Read The Original File Names
  try {
    return (await promises.readdir(originalPath)).map(
      (filename: string): string => filename.split('.')[0]
    )
  } catch {
    return []
  }
}

export const checkResizedPath = async (): Promise<void> => {
  try {
    await promises.access(resizedPath) // if exist
  } catch {
    await promises.mkdir(resizedPath) // if not exist create it
  }
}

export const removeResizedFolder = async (): Promise<void> => {
  try {
    await promises.access(resizedPath)
    await promises.rm(resizedPath, { recursive: true })
  } catch {
    null
  }
}

export const removeFile = async (
  image: FileProperties
): Promise<null | string> => {
  let path = ''

  if (image.height && image.width) {
    // the path if we already have resized image
    path = resized(image.filename, image.height, image.width)
    try {
      await promises.unlink(path)
    } catch {
      path = ''
    }
  }
  return path
}
