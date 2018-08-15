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
import * as bcrypt from 'bcryptjs'
import { createConfirmEmailLink, sendEmail } from '../../utils/SendEmail'

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
        return formatYupError(e)
      }

      const { email, password } = args

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
      })

      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: duplicateEmail,
          },
        ]
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = User.create({
        email,
        password: hashedPassword,
      })

      await user.save()

      if (process.env.NODE_ENV !== 'test') {
        const { request, redis } = context
        const url = request.protocol + '://' + request.get('host')
        await sendEmail(email, await createConfirmEmailLink(url, user.id, redis))
      }

      return null
    },
  },
}
