import axios, { AxiosResponse } from 'axios'

export function graphQLRequest(payload: string) {
  const url = process.env.TEST_HOST as string
  return axios.post(url, { query: payload })
}

export function mapErrorsMessage(response: AxiosResponse) {
  const errors: any[] = response.data.errors
  return errors.map(i => i.message)
}
