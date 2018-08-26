import axios from 'axios'

export function graphQLRequest(payload: string) {
  const url = process.env.TEST_HOST as string
  return axios.post(url, { query: payload })
}
