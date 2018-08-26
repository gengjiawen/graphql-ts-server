import * as yup from 'yup'
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from './ErrorMessages'
import { ResolverMap } from '../../types/GraphQLUtil'
import { formatYupError } from '../../utils/FormatYupError'
import { User } from '../../entity/User'
import { createConfirmEmailLink, sendEmail } from '../../utils/SendEmail'
import { GraphQLError } from 'graphql'
import { signUser } from '../../utils/JwtUtil'

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(128)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255),
})

export const resolvers: ResolverMap = {
  Query: {
    hello: _ => {
      return 'hello, cute'
    },
  },
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments, context) => {
      try {
        await schema.validate(args, { abortEarly: false })
      } catch (e) {
        throw formatYupError(e)[0]
      }

      const { email, password } = args

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
      })

      if (userAlreadyExists) {
        throw new GraphQLError(duplicateEmail)
      }

      const user = User.create({
        email,
        password,
      })

      await user.save()

      if (process.env.NODE_ENV !== 'test') {
        const { request, redis } = context
        const url = request.protocol + '://' + request.get('host')
        await sendEmail(email, await createConfirmEmailLink(url, user.id, redis))
      }
      const token = signUser(user)
      return {
        token,
      }
    },
  },
}
