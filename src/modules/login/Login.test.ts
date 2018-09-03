import { graphQLRequest, mapErrorsMessage } from '../../jest/GraphQLTestUtil'
import { User } from '../../entity/User'
import { loginMutation, registerMutation } from '../../jest/shared.query'
import { createTypeormConn } from '../../utils/CreateTyepeormConn'

const email = 'jack_login@test.com'
const password = '123456'

beforeAll(async () => {
  await createTypeormConn()
})

test('login successfully', async () => {
  const registerRes: any = await graphQLRequest(registerMutation(email, password))
  expect(registerRes.data.data.register.token).not.toBeNull()
  await User.update({ email }, { confirmed: true })

  // login success
  const loginRes: any = await graphQLRequest(loginMutation(email, password))
  expect(loginRes.data.data.login.token).not.toBeNull()
  expect(loginRes.data.data.errors).toBeUndefined()

  // login with wrong password
  const loginWrongPassRes: any = await graphQLRequest(loginMutation(email, '123'))
  expect(loginWrongPassRes.data.data.login).toBeNull()
  expect(mapErrorsMessage(loginWrongPassRes)).toMatchSnapshot()
})
