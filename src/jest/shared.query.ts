export const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    token
  }
}`

export const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    token
  }
}`
