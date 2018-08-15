import axios from 'axios'

test('sends invalid back if bad id sent', async () => {
  const response = await axios.get(`${process.env.TEST_HOST}/confirm/900813`)
  const text = response.data
  expect(text).toEqual('invalid')
})
