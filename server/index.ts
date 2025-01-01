import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { expensesRoute } from './routes/expenses.js'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

app.use("*", logger())

const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expensesRoute)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

export type ApiRoutes = typeof apiRoutes