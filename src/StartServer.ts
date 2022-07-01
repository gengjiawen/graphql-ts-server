import * as Koa from 'koa'
import * as Router from '@koa/router'
import * as cors from '@koa/cors'
import 'reflect-metadata'
import { createTypeormConn } from './utils/CreateTyepeormConn'
import { createSchema } from './utils/SchemaUtil'
import { redis } from './RedisInstance'
import { confirmEmail } from './routes/ConfirmEmail'
import { Context } from 'koa'
import { ApolloServer } from 'apollo-server-koa'

export const startServer = async () => {
  const schema = await createSchema()

  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ ctx }: { ctx: Context }) => ({
      redis,
      request: ctx.request,
    }),
  })

  const app = new Koa()
  app.use(require('koa-compress')())
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/' })

  const router = new Router()

  // @ts-ignore
  router.get('/confirm/:id', confirmEmail)

  await createTypeormConn()

  app.use(cors())
  app.use(router.routes()).use(router.allowedMethods())

  const port: number = process.env.NODE_ENV === 'test' ? 9527 : 4000
  const server = app.listen(
    {
      port,
    },
    () => {
      console.log(`server is running on localhost:${port}`)
    }
  )

  return server
}
