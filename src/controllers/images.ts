import { Request, Response } from 'express'
import { resizeImage } from '../utils/sharp-util'
import { accessFilePath, availableFileNames } from '../utils/file-util'
import asyncHandler from 'express-async-handler'

interface ImageProperties {
  filename?: string
  width?: string
  height?: string
}

const isNotNumPositive = (
  height: string | null | undefined,
  width: string | null | undefined
): boolean => {
  let isNumH = false
  let isNumW = false
  if (height) {
    isNumH = /^\d+$/.test(height) && parseInt(height) > 0
  }
  if (width) {
    isNumW = /^\d+$/.test(width) && parseInt(width) > 0
  }
  return !(isNumH && isNumW)
}

export const imageProcessing = asyncHandler(
  async (req: Request, res: Response) => {
    const image: ImageProperties = req.query
    const width: number = parseInt(image.width || '')
    const height: number = parseInt(image.height || '')

    // check if user provide query params correctly
    if (!image.filename) {
      res
        .status(400)
        .send({ status: 400, message: 'Please provide a filename!' })
      return
    }

    // Get an image path if the user provided a filename
    const filename: string = image.filename || ''
    const filePath: string | null = await accessFilePath({
      filename,
      width,
      height,
    })

    // Check if file name available
    const files = await availableFileNames()
    if (!files.includes(image.filename || '')) {
      res.status(400).send({
        status: 400,
        message: 'Sorry, the file name does not exist!',
        availableFiles: files,
      })
      return
    }

    // Show an image if the user provided a filename
    if (filePath && image.height && image.width) {
      // Check if height and width queries are only digits
      if (isNotNumPositive(image.height, image.width)) {
        res.status(400).send({
          status: 400,
          message: 'Shoud Provide height and width, a Numeric Positive Value',
        })
        return
      } else {
        res.status(200).sendFile(filePath)
        return
      }
    } else if (filePath && !image.height && !image.width) {
      res.status(200).sendFile(filePath)
      return
    }

    if (filePath && (!image.height || !image.width)) {
      res.status(400).send({
        status: 400,
        message: 'both Height and Width should be provided together',
      })
      return
    }

    // Check if height and width queries are only digits
    if (isNotNumPositive(image.height, image.width)) {
      res.status(400).send({
        status: 400,
        message: 'Shoud Provide height and width, a Numeric Positive Value',
      })
      return
    }

    // Resize given image
    const resizedImagePath: string | null = await resizeImage({
      filename,
      width,
      height,
    })

    if (resizedImagePath) {
      return res.status(201).sendFile(resizedImagePath)
    } else {
      res.status(500).send({ status: 500, message: 'Sorry, Something wrong!' })
      return
    }
  }
)
