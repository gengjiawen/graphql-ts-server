import { startServer } from './StartServer'

startServer().catch(error => {
  console.log(error)
})
