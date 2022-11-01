import express, { Express, Request, Response } from 'express'
import routes from './routes'
import morgan from 'morgan'

const app: Express = express()
const port = 5000

app.use(morgan('dev'))

// Main Route
app.use('/', routes)

// Response for any other Path Not Found
app.use(async (req: Request, res: Response) => {
  return res.status(404).send({ status: 404, message: 'Path Not Found!' })
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App Listening on port ${port}`)
})

export default app
