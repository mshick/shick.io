import {
  CmsCollectionFormatType,
  type CmsCollection,
  type CmsConfig,
  type CmsField,
  type CmsFieldBase,
  type CmsFieldBoolean,
  type CmsFieldDateTime,
  type CmsFieldList,
  type CmsFieldMarkdown,
  type CmsFieldNumber,
  type CmsFieldObject,
  type CmsFieldSelect,
  type CmsFieldStringOrText
} from '#/types/decap-cms'
import merge from 'lodash/merge.js'
import trim from 'lodash/trim.js'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, sep } from 'node:path'
import { cwd } from 'node:process'
import { z, type Collection, type Config } from 'velite'
import { UPLOADS_BASE, UPLOADS_PATH } from './constants'
import { getCollectionBasePath } from './fields'
import { ENUM_MULTIPLE, ISODATE, MARKDOWN, type Options } from './schema'

const veliteFields = ['metadata', 'toc']
const bodyFieldName = 'body';

type FieldAcc = Pick<CmsFieldBase, 'label' | 'name' | 'required'> & {
  default?: unknown
}

function cleanOptionals(obj: Record<string, unknown>) {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      return value === null || value === '' ? undefined : value
    })
  )
}

function getSchemaBaseType(
  schema: z.ZodSchema<any>,
  acc: { required?: boolean; default?: unknown }
) {
  if (schema instanceof z.ZodEffects) {
    return getSchemaBaseType(schema.sourceType(), acc)
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    acc.required = false
    return getSchemaBaseType(schema.unwrap(), acc)
  }

  if (schema instanceof z.ZodPipeline) {
    return getSchemaBaseType(schema._def.in, acc)
  }

  if (schema instanceof z.ZodDefault) {
    acc.default = schema._def.defaultValue()
    return getSchemaBaseType(schema._def.innerType, acc)
  }

  if ('unwrap' in schema && typeof schema.unwrap === 'function') {
    // Default handler for any unwrappable type
    return getSchemaBaseType(schema.unwrap(), acc)
  }

  return schema
}

function schemaToFields(schema: z.ZodObject<any>) {
  const fields: CmsField[] = []

  for (const shapeName in schema.shape) {
    const fieldBase: FieldAcc = {
      name: shapeName,
      required: true
    }

    const shapeField = schema.shape[shapeName]
    const shapeBaseType = getSchemaBaseType(shapeField, fieldBase)

    if (shapeField.description === MARKDOWN) {
      const field: CmsFieldBase & CmsFieldMarkdown = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        widget: 'markdown'
      }
      fields.push(field)
      continue
    }

    if (shapeField.description === ISODATE) {
      const field: CmsFieldBase & CmsFieldDateTime = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        widget: 'datetime'
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodArray) {
      const field: CmsFieldBase & CmsFieldList = {
        ...fieldBase,
        widget: 'list',
        collapsed: true,
        max: shapeField._def.maxLength?.value ?? undefined,
        min: shapeField._def.minLength?.value ?? undefined
      }

      const arrayBaseType = getSchemaBaseType(shapeBaseType.element, {})

      if (arrayBaseType instanceof z.ZodObject) {
        field.fields = schemaToFields(arrayBaseType)
      }

      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodObject) {
      const objectFields = schemaToFields(shapeBaseType)

      if (objectFields.length) {
        const field: CmsFieldBase & CmsFieldObject = {
          ...fieldBase,
          default:
            typeof fieldBase.default === 'string'
              ? fieldBase.default
              : undefined,
          widget: 'object',
          fields: objectFields,
          collapsed: true
        }
        fields.push(field)
      } else {
        const field: CmsFieldBase & CmsFieldStringOrText = {
          ...fieldBase,
          default:
            typeof fieldBase.default === 'string'
              ? fieldBase.default
              : undefined,
          widget: 'string'
        }
        fields.push(field)
      }

      continue
    }

    if (shapeBaseType instanceof z.ZodNumber) {
      const field: CmsFieldBase & CmsFieldNumber = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ||
          typeof fieldBase.default === 'number'
            ? fieldBase.default
            : undefined,
        widget: 'number',
        max: shapeBaseType.maxValue ?? undefined,
        min: shapeBaseType.minValue ?? undefined
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodString) {
      const maxValue =
        shapeBaseType._def.checks.find((c) => c.kind === 'max')?.value ?? 0
      const field: CmsFieldBase & CmsFieldStringOrText = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        widget: maxValue > 120 ? 'text' : 'string'
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodBoolean) {
      const field: CmsFieldBase & CmsFieldBoolean = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'boolean'
            ? fieldBase.default
            : undefined,
        widget: 'boolean'
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodEnum) {
      const field: CmsFieldBase & CmsFieldSelect = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        widget: 'select',
        multiple: shapeField.description === ENUM_MULTIPLE,
        options: shapeBaseType._def.values
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodLiteral) {
      // Do nothing
      continue
    }

    if (shapeBaseType instanceof z.ZodAny && veliteFields.includes(shapeName)) {
      // Do nothing
      continue
    }

    console.log('unhandled field', {
      fieldName: shapeName,
      field: shapeBaseType,
      description: shapeBaseType.description
    })
  }

  return fields
}

function sortSchemaFields(fields: CmsField[]) {
  const bodyFieldIndex = fields.findIndex(f => f.name === bodyFieldName)

  if (bodyFieldIndex > -1) {
    fields.push(fields.splice(bodyFieldIndex, 1)[0]!)
  }

  return fields
}

function getCollectionFolder(basePath: string, pattern: string) {
  const parts = pattern.split(sep)
  const globRe = /[*|[]/
  const globStart = parts.findIndex((p) => globRe.exec(p))
  const pathParts = globStart > -1 ? parts.slice(0, globStart) : parts
  return join(basePath, ...pathParts)
}

function createCmsCollection(
  basePath: string,
  name: string,
  collection: Collection,
  options: Pick<Options, 'repo' | 'collections'>
): CmsCollection {
  const schema = getSchemaBaseType(collection.schema, {})

  if (!(schema instanceof z.ZodObject)) {
    throw new Error('Invalid schema provided, must be of type object')
  }

  const cmsCollection: Partial<CmsCollection> = {
    label: collection.name,
    name,
    preview_path: join(getCollectionBasePath(name), '{{slug}}')
  }

  const pattern = Array.isArray(collection.pattern)
    ? collection.pattern[0]
    : collection.pattern

  if (!pattern) {
    throw new Error(`Invalid pattern in collection ${collection.name}`)
  }

  if (collection.single) {
    cmsCollection.type = 'file_based_collection'
    cmsCollection.files = [
      {
        file: getCollectionFolder(basePath, pattern),
        name: pattern,
        label: pattern,
        fields: sortSchemaFields(schemaToFields(schema))
      }
    ]
  } else {
    cmsCollection.type = 'folder_based_collection'
    cmsCollection.folder = getCollectionFolder(basePath, pattern)
    cmsCollection.fields = sortSchemaFields(schemaToFields(schema))
    cmsCollection.create = true
    cmsCollection.extension = trim(extname(pattern).toLowerCase(), '.')

    if (['yml', 'yaml'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.YAML
    }

    if (['toml'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.TOML
    }

    if (['json'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.JSON
    }

    if (['md', 'markdown', 'mdx'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.YAMLFrontmatter
    }

    if (['mdx'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.Frontmatter
    }    
  }

  const overrides = options.collections?.find((c) => c.name === name)

  return merge(
    cmsCollection,
    overrides?.cms ? cleanOptionals(overrides.cms) : undefined
  ) as CmsCollection
}

export function getCmsConfig(
  config: Config,
  options: Pick<Options, 'url' | 'repo' | 'collections' | 'cms'>
) {
  const basePath = relative(cwd(), config.root)

  const collections: CmsCollection[] = []

  for (const [name, collection] of Object.entries(config.collections)) {
    collections.push(createCmsCollection(basePath, name, collection, options))
  }

  const url = new URL(options.url)

  const cmsConfig: CmsConfig = {
    site_url: url.toString(),
    backend: {
      name: options.repo.provider,
      repo: options.repo.name,
      branch: options.repo.branch,
      site_domain: url.host,
      base_url: url.origin,
      auth_endpoint: 'oauth'
    },
    publish_mode: 'simple',
    media_folder: UPLOADS_BASE,
    public_folder: UPLOADS_PATH,
    show_preview_links: true,
    editor: {
      preview: true
    },
    collections,
    ...(options.cms ? cleanOptionals(options.cms) : undefined)
  }

  return cmsConfig
}

export async function generateCmsConfig(
  config: Config,
  options: Pick<Options, 'url' | 'repo' | 'collections' | 'cms'>,
  { filePath }: { filePath: string }
) {
  const cmsConfig = getCmsConfig(config, options)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(cmsConfig, null, 2))
}
