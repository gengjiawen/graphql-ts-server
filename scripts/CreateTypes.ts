import { generateNamespace } from '@gql2ts/from-schema'
import { genSchema } from '../src/utils/GenSchema'
import * as fs from 'fs'
import * as path from 'path'

const tsTypes = generateNamespace('GQL', genSchema())

fs.writeFileSync(path.join(__dirname, '../src/types/schema.d.ts'), tsTypes)
