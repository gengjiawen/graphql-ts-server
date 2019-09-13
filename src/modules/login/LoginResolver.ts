import * as bcrypt from 'bcryptjs'
import { User } from '../../entity/User'
import { confirmEmailError, invalidLogin } from './ErrorMessages'
import { GraphQLError } from 'graphql'
import { signUser } from '../../utils/JwtUtil'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { Token } from '../Token'

@Resolver()
export class LoginResolver {
  @Mutation(() => Token)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new GraphQLError(invalidLogin)
    }

    if (!user.confirmed) {
      throw new GraphQLError(confirmEmailError)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new GraphQLError(invalidLogin)
    }

    const token = signUser(user)
    return {
      token,
    }
  }
}
