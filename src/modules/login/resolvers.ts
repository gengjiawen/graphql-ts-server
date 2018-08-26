import * as bcrypt from 'bcryptjs'
import { ResolverMap } from '../../types/GraphQLUtil'
import { User } from '../../entity/User'
import { confirmEmailError, invalidLogin } from './ErrorMessages'
import { GraphQLError } from 'graphql'
import { signUser } from '../../utils/JwtUtil'

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments) => {
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
      return { token }
    },
  },
}
