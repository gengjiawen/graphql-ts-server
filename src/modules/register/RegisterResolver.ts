import { User } from '../../entity/User'
import { createConfirmEmailLink, sendEmail } from '../../utils/SendEmail'
import { signUser } from '../../utils/JwtUtil'
import { Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { RegisterInput } from './RegisterInput'
import { Context } from 'koa'
import { Token } from '../Token'
import { GraphQLError } from 'graphql'
import { duplicateEmail } from './ErrorMessages'

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  hello() {
    return 'Hello World'
  }

  @Mutation(() => Token)
  async register(@Args() { email, password }: RegisterInput, @Ctx() context: Context) {
    const userAlreadyExists = await User.findOne({
      where: { email },
      select: ['id'],
    })

    if (userAlreadyExists) {
      throw new GraphQLError(duplicateEmail)
    }

    const user = await User.create({
      email,
      password,
    }).save()

    if (process.env.NODE_ENV !== 'test') {
      const { request, redis } = context
      const url = request.protocol + '://' + request.get('host')
      await sendEmail(email, await createConfirmEmailLink(url, user.id, redis))
    }
    const token = signUser(user)
    return {
      token,
    }
  }
}
