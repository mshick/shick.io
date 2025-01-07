import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Options } from './schema';

const __dirname = import.meta.dirname;

const { timezone, repo, collections, url }: Options = parseYaml(
  readFileSync(join(__dirname, '../content/options.yml'), 'utf8'),
);

export { collections, repo, timezone, url };
