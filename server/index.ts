import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config';
import { logger } from 'hono/logger'
import { serveStatic } from '@hono/node-server/serve-static'
import { expensesRoute } from './routes/expenses.js'
import { authRoute } from './routes/auth.js'

const app = new Hono()

app.use("*", logger())

const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expensesRoute)
  .route("/", authRoute)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

export type ApiRoutes = typeof apiRoutes