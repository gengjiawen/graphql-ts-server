import { startServer } from '../StartServer'
import { AddressInfo } from 'net'

export default async function() {
  if (!process.env.TEST_HOST) {
    const app = await startServer()
    const { port } = app.address() as AddressInfo
    const testHost = `http://localhost:${port}`
    console.log(testHost)
    process.env.TEST_HOST = testHost
  }
}
