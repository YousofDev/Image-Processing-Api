import express, { Request, Response, Router } from 'express'
import images from './api/images'
import homeView from '../utils/home-view'

const routes: Router = express.Router()

routes.get('/', (req: Request, res: Response) => {
  res.status(200).send(homeView)
})

routes.use('/api/images', images)

export default routes
