import { request } from 'graphql-request'
import { User } from '../../../entity/User'
import { duplicateEmail } from '../ErrorMessages'
import { createTypeormConn } from '../../../utils/CreateTyepeormConn'

beforeAll(async () => {
  await createTypeormConn()
})

const email = 'tom@bob.com'
const password = '123456'

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}`
test('register user', async () => {
  const url = process.env.TEST_HOST as string
  const response = await request(url, mutation(email, password))
  expect(response).toEqual({ register: null })
  const users = await User.find({ where: { email } })
  expect(users).toHaveLength(1)
  const user = users[0]
  expect(user.email).toEqual(email)
  expect(user.password).not.toEqual(password)

  // test duplicate email
  const response2: any = await request(url, mutation(email, password))
  expect(response2.register).toHaveLength(1)
  expect(response2.register[0]).toEqual({
    path: 'email',
    message: duplicateEmail,
  })

  // catch bad password
  const response3: any = await request(url, mutation(email, 'ab'))
  expect(response3).toMatchSnapshot()

  // catch bad email and password
  const response4: any = await request(url, mutation('ab', 'cd'))
  expect(response4).toMatchSnapshot()
})
