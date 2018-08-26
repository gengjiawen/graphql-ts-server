import { User } from '../../../entity/User'
import { duplicateEmail } from '../ErrorMessages'
import { createTypeormConn } from '../../../utils/CreateTyepeormConn'
import { graphQLRequest, mapErrorsMessage } from '../../../jest/GraphQLTestUtil'
import { Connection } from 'typeorm'

let conn: Connection
beforeAll(async () => {
  conn = await createTypeormConn()
})

afterAll(async () => {
  conn.close()
})

const email = 'tom@bob.com'
const password = '123456'

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    token
  }
}`

test('register user', async () => {
  const response: any = await graphQLRequest(mutation(email, password))
  expect(response.data.data.register.token).not.toBeNull()
  const users = await User.find({ where: { email } })
  expect(users).toHaveLength(1)
  const user = users[0]
  expect(user.email).toEqual(email)
  expect(user.password).not.toEqual(password)

  // test duplicate email
  const response2 = await graphQLRequest(mutation(email, password))
  expect(response2.data.data.register).toBeNull()
  expect(response2.data.errors[0].message).toEqual(duplicateEmail)

  // catch bad password
  const response3 = await graphQLRequest(mutation(email, 'ab'))
  expect(mapErrorsMessage(response3)).toMatchSnapshot('catch bad password')

  // catch bad email and password
  const response4 = await graphQLRequest(mutation('ab', 'cd'))
  expect(mapErrorsMessage(response4)).toMatchSnapshot('catch bad email and password')
})
