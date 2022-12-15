import { bold } from 'cli-color'
import { config } from 'dotenv'
import { join } from 'path'
import { table } from 'table'

const { parsed } = config({
  path: join(__dirname, '../.env.local'),
  encoding: 'UTF-8'
})

if (parsed) {
  console.log(
    table(Object.entries<string>(parsed), {
      header: {
        alignment: 'center',
        content: bold.blue('ENVIRONMENT VARIABLES (DEVELOPMENT)')
      }
    })
  )
}
