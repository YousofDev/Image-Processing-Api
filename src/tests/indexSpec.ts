import app from '../index'
import supertest from 'supertest'
import {
  removeResizedFolder,
  removeFile,
  accessFilePath,
  resized,
} from '../utils/file-util'
import { resizeImage } from '../utils/sharp-util'

const request = supertest(app)

beforeAll(async (): Promise<void> => {
  await removeResizedFolder()
})

afterAll(async (): Promise<void> => {
  await removeResizedFolder()
})

describe('Testing Home Page', () => {
  it('endpoint: /', async () => {
    const response = await request.get('/')
    expect(response.status).toBe(200)
  })
})

describe('Testing Not Found Page', () => {
  it('endpoint: /api', async () => {
    const response = await request.get('/api')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Path Not Found!')
  })
})

describe('Testing Missing Query Parameters', () => {
  it('endpoint: /api/images', async () => {
    const response = await request.get('/api/images')
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Please provide a filename!')
  })
})

describe('Testing Available Filename in Original Folder', () => {
  it('endpoint: /api/images?filename=coffin', async () => {
    const response = await request.get('/api/images?filename=coffin')
    expect(response.status).toBe(200)
  })
})

describe('Testing Not Available Filename in Original Folder', () => {
  it('endpoint: /api/images?filename=photo', async () => {
    const response = await request.get('/api/images?filename=photo')
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Sorry, the file name does not exist!')
  })
})

describe('Testing Missing Width or Height', () => {
  it('endpoint: /api/images?filename=coffin&width=400', async () => {
    const response = await request.get('/api/images?filename=coffin&width=400')
    expect(response.body.message).toBe(
      'both Height and Width should be provided together'
    )
    expect(response.status).toBe(400)
  })
})

describe('Testing Resizing new image and save it', () => {
  it('endpoint: /api/images?filename=coffin&width=783&height=783', async () => {
    const response = await request.get(
      '/api/images?filename=coffin&width=783&height=783'
    )
    expect(response.status).toBe(201)
  })
})

describe('Testing Resizing an image already exists in resized folder, So returned rather than recreate it', () => {
  it('endpoint: /api/images?filename=coffin&width=783&height=783', async () => {
    const response = await request.get(
      '/api/images?filename=coffin&width=783&height=783'
    )
    expect(response.status).toBe(200)
  })
})

// ************************************ Testing Image Processing Function **********************

describe('Testing Image Processing Function', () => {
  it('check if exist => delete it => then check if realy deleted => then recreate it => theck if exist', async () => {
    const image = { filename: 'coffin', width: 783, height: 783 }
    // Step 1): Check Existence:
    let imagePath = await accessFilePath(image)
    expect(imagePath).toBe(resized('coffin', 783, 783))
    // Step 2): Deleting
    imagePath = await removeFile(image)
    // Step 3): Check Existence After Deleting:
    imagePath = await accessFilePath(image)
    expect(imagePath).toBeNull()
    // Step 4): Resizing New One:
    imagePath = await resizeImage(image)
    // Step 5): Check Existence After Creating:
    imagePath = await accessFilePath(image)
    expect(imagePath).toBe(resized('coffin', 783, 783))
  })
})

// ************************************************************************************************

describe('Testing Non-numeric Non-positive Height, Width', () => {
  it('endpoint: /api/images?filename=coffin&width=-200&height=kjk', async () => {
    const response = await request.get(
      '/api/images?filename=coffin&width=-200&height=kjk'
    )
    expect(response.body.message).toBe(
      'Shoud Provide height and width, a Numeric Positive Value'
    )
    expect(response.status).toBe(400)
  })
})
