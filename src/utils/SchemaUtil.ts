import { buildSchema } from 'type-graphql'
import { RegisterResolver } from '../modules/register/RegisterResolver'
import { LoginResolver } from '../modules/login/LoginResolver'

export const createSchema = () =>
  buildSchema({
    resolvers: [RegisterResolver, LoginResolver],
  })
