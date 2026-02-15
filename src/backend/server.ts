import { Hono } from 'hono'
const app = new Hono()

app.get('/api/test', (c) => c.text('1233'))

export default app