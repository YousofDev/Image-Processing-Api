import express, { Router } from 'express'
import { imageProcessing } from '../../controllers/images'

const images: Router = express.Router()

images.get('/', imageProcessing) // I know this should be POST Method in real restApi

export default images
