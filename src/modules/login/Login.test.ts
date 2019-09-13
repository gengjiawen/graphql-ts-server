import { graphQLRequest, mapErrorsMessage } from '../../jest/GraphQLTestUtil'
import { User } from '../../entity/User'
import { loginMutation } from '../../jest/shared.query'
import { createTypeormConn } from '../../utils/CreateTyepeormConn'

const email = 'jack_login@test.com'
const password = '123456'

beforeAll(async () => {
  await createTypeormConn()
  await User.create({
    email,
    password,
    confirmed: true,
  }).save()
})

test('login successfully', async () => {
  const loginRes: any = await graphQLRequest(loginMutation(email, password))
  expect(loginRes.data.data.login.token).not.toBeNull()
  expect(loginRes.data.data.errors).toBeUndefined()
})

test('login with wrong password', async () => {
  const loginWrongPassRes: any = await graphQLRequest(loginMutation(email, '123'))
  expect(loginWrongPassRes.data.data).toBeNull()
  expect(mapErrorsMessage(loginWrongPassRes)).toMatchSnapshot()
})
