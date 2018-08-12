import { ValidationError } from 'yup'

export const formatYupError = (error: ValidationError) => {
  const errors: Array<{ path: string; message: string }> = []
  error.inner.forEach(e => {
    errors.push({
      path: e.path,
      message: e.message,
    })
  })

  return errors
}
