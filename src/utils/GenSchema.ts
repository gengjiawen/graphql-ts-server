import { GraphQLSchema } from 'graphql'
import * as fs from 'fs'
import * as path from 'path'
import { importSchema } from 'graphql-import'
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools'

export function genSchema() {
  const schemas: GraphQLSchema[] = []
  const modulePath = path.join(__dirname, '../modules')
  console.log(modulePath)
  const folders = fs.readdirSync(modulePath)
  folders.forEach(folder => {
    const schemaPath = `${modulePath}/${folder}/schema.graphql`
    if (!fs.existsSync(schemaPath)) {
      console.log(`schema path: ${schemaPath} has no graphql definition, skipping`)
      return
    }
    const { resolvers } = require(`${modulePath}/${folder}/resolvers`)
    const typeDefs = importSchema(schemaPath)
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }))
  })
  const schema = mergeSchemas({ schemas })
  return schema
}
