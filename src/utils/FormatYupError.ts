import { ValidationError } from 'yup'
import { UserInputError } from 'apollo-server-koa'

export const formatYupError = (error: ValidationError) => {
  const errors: Array<UserInputError> = []
  error.inner.forEach(e => {
    errors.push(new UserInputError(e.message))
  })

  return errors
}
