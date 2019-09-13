import { User } from '../../entity/User'
import { duplicateEmail } from './ErrorMessages'
import { createTypeormConn } from '../../utils/CreateTyepeormConn'
import { graphQLRequest, mapErrorsMessage } from '../../jest/GraphQLTestUtil'
import { registerMutation } from '../../jest/shared.query'

beforeAll(async () => {
  await createTypeormConn()
})

const email = 'jack_register@test.com'
const password = '123456'

test('register user', async () => {
  const response: any = await graphQLRequest(registerMutation(email, password))
  expect(response.data.data.register.token).not.toBeNull()
  const users = await User.find({ where: { email } })
  expect(users).toHaveLength(1)
  const user = users[0]
  expect(user.email).toEqual(email)
  expect(user.password).not.toEqual(password)

  // test duplicate email
  const response2 = await graphQLRequest(registerMutation(email, password))
  expect(response2.data.data).toBeNull()
  expect(response2.data.errors[0].message).toEqual(duplicateEmail)

  // catch bad password
  const response3 = await graphQLRequest(registerMutation(email, 'ab'))
  expect(
    mapErrorsMessage(response3)[0].validationErrors.map((i: any) => i.constraints)
  ).toMatchSnapshot('catch bad password')

  // catch bad email and password
  const response4 = await graphQLRequest(registerMutation('ab', 'cd'))
  expect(
    mapErrorsMessage(response4)[0].validationErrors.map((i: any) => i.constraints)
  ).toMatchSnapshot('catch bad email and password')
})
