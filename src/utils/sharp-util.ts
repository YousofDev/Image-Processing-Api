import sharp from 'sharp'
import { checkResizedPath, original, resized } from './file-util'

interface ResizedImage {
  filename: string
  width: number
  height: number
}

export const resizeImage = async (
  image: ResizedImage
): Promise<string | null> => {
  // eslint-disable-next-line no-console
  console.log(image)
  // First check if resized folder exist
  await checkResizedPath()
  // Second Resize the image and save it on resizedPath
  const originalFile = original(image.filename)
  const resizedFile = resized(image.filename, image.height, image.width)
  try {
    await sharp(originalFile)
      .resize(image.width, image.height)
      .toFormat('jpeg')
      .toFile(resizedFile)
    return resizedFile
  } catch {
    return null
  }
}
