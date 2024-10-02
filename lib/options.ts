import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'

const __dirname = import.meta.dirname

type Options = {
  timezone: string
  repoUrlPattern?: string
  collectionPaths?: Record<string, string>
  url: string
}

const { timezone, repoUrlPattern, collectionPaths, url }: Options = parseYaml(
  readFileSync(join(__dirname, '../content/site/options.yml'), 'utf8')
)

export { collectionPaths, repoUrlPattern, timezone, url }
