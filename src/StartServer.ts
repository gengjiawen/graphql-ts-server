import { GraphQLServer } from 'graphql-yoga'
import { createTypeormConn } from './utils/CreateTyepeormConn'
import { genSchema } from './utils/GenSchema'

export const startServer = async () => {
  const schema = genSchema()

  const server = new GraphQLServer({ schema: schema })
  await createTypeormConn()

  const port: number = process.env.NODE_ENV === 'test' ? 9527 : 4000
  const app = await server.start(
    {
      port,
    },
    () => {
      console.log(`server is running on localhost:${port}`)
    }
  )

  return app
}
