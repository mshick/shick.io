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
  type CmsFieldRelation,
  type CmsFieldSelect,
  type CmsFieldStringOrText
} from '#/types/decap-cms'
import isPlainObject from 'lodash/isPlainObject.js'
import merge from 'lodash/merge.js'
import trim from 'lodash/trim.js'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, sep } from 'node:path'
import { cwd } from 'node:process'
import { z, type Collection, type Config } from 'velite'
import { UPLOADS_BASE, UPLOADS_PATH } from './constants'
import { getCollectionBasePath } from './fields'
import { ISODATE, MARKDOWN, RELATION, type Options } from './schema'
import { makeSparse, safeParseJsonString } from './util'

const veliteFields = ['metadata', 'toc']
const bodyFieldName = 'body'

type FieldAcc = Pick<
  CmsFieldBase,
  'label' | 'name' | 'required' | 'comment'
> & {
  default?: unknown
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

export const cmsField = z
  .object({
    widget: z
      .enum([
        'color',
        'relation',
        'boolean',
        'string',
        'text',
        'code',
        'datetime',
        'file',
        'image',
        'object',
        'list',
        'markdown',
        'map',
        'number',
        'select',
        'hidden'
      ])
      .optional(),
    name: z.string().optional()
  })
  .passthrough()

function getFieldCustom(description: string): Partial<CmsField> | undefined {
  const maybeJson = safeParseJsonString(description)

  if (typeof maybeJson === 'string') {
    return cmsField.safeParse({ widget: maybeJson }).data
  } else if (isPlainObject(maybeJson)) {
    return cmsField.safeParse(maybeJson).data
  }

  return
}

function schemaToFields(
  schema: z.ZodObject<any>,
  collection: Pick<CmsCollection, 'name' | 'identifier_field'>,
  collections: Pick<CmsCollection, 'name' | 'identifier_field'>[]
) {
  const fields: CmsField[] = []

  for (const shapeName in schema.shape) {
    const fieldBase: FieldAcc = {
      name: shapeName,
      required: true
    }

    const shapeField = schema.shape[shapeName]
    const shapeBaseType = getSchemaBaseType(shapeField, fieldBase)

    const fieldCustom = getFieldCustom(shapeField.description)

    if (fieldCustom?.widget === MARKDOWN) {
      const field: CmsFieldBase & CmsFieldMarkdown = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        ...fieldCustom,
        widget: fieldCustom.widget
      }
      fields.push(field)
      continue
    }

    if (fieldCustom?.widget === ISODATE) {
      const field: CmsFieldBase & CmsFieldDateTime = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        ...fieldCustom,
        widget: fieldCustom.widget
      }
      fields.push(field)
      continue
    }

    if (fieldCustom?.widget === RELATION) {
      const defaultVal =
        Array.isArray(fieldBase.default) ||
        typeof fieldBase.default === 'string'
          ? fieldBase.default
          : undefined

      const collectionName =
        (fieldCustom as CmsFieldRelation)?.collection ?? collection.name
      const relationCollection = collections.find(
        (c) => c.name === collectionName
      )

      if (!relationCollection) {
        throw new Error(`Invalid collection name '${collectionName}'`)
      }

      const field: CmsFieldBase & CmsFieldRelation = {
        ...fieldBase,
        default: defaultVal,
        multiple: shapeBaseType instanceof z.ZodArray,
        collection: collectionName,
        value_field: '{{slug}}',
        display_fields: [
          relationCollection.identifier_field
            ? relationCollection.identifier_field
            : 'title'
        ],
        dropdown_threshold: 0,
        ...fieldCustom,
        widget: fieldCustom.widget
      }

      fields.push(field)
      continue
    }

    fieldBase.comment = shapeField.description

    if (shapeBaseType instanceof z.ZodArray) {
      const field: CmsFieldBase & CmsFieldList = {
        ...fieldBase,
        collapsed: true,
        max: shapeField._def.maxLength?.value ?? undefined,
        min: shapeField._def.minLength?.value ?? undefined,
        ...fieldCustom,
        widget: 'list'
      }

      const arrayBaseType = getSchemaBaseType(shapeBaseType.element, {})

      if (arrayBaseType instanceof z.ZodObject) {
        field.fields = schemaToFields(arrayBaseType, collection, collections)
      }

      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodObject) {
      const objectFields = schemaToFields(
        shapeBaseType,
        collection,
        collections
      )
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldStringOrText)?.default

      if (objectFields.length) {
        const field: CmsFieldBase & CmsFieldObject = {
          ...fieldBase,
          fields: objectFields,
          collapsed: true,
          ...fieldCustom,
          default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
          widget: 'object'
        }
        fields.push(field)
      } else {
        const field: CmsFieldBase & CmsFieldStringOrText = {
          ...fieldBase,
          ...fieldCustom,
          default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
          widget: 'string'
        }
        fields.push(field)
      }

      continue
    }

    if (shapeBaseType instanceof z.ZodNumber) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldNumber)?.default

      const field: CmsFieldBase & CmsFieldNumber = {
        ...fieldBase,
        max: shapeBaseType.maxValue ?? undefined,
        min: shapeBaseType.minValue ?? undefined,
        ...fieldCustom,
        default:
          typeof fieldDefault === 'string' || typeof fieldDefault === 'number'
            ? fieldDefault
            : undefined,
        widget: 'number'
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodString) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldStringOrText)?.default

      const maxValue =
        shapeBaseType._def.checks.find((c) => c.kind === 'max')?.value ?? 0
      const field: CmsFieldBase & CmsFieldStringOrText = {
        ...fieldBase,
        ...fieldCustom,
        default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
        widget: maxValue > 120 ? 'text' : 'string'
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodBoolean) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldBoolean)?.default

      const field: CmsFieldBase & CmsFieldBoolean = {
        ...fieldBase,
        ...fieldCustom,
        default: typeof fieldDefault === 'boolean' ? fieldDefault : undefined,
        widget: 'boolean'
      }
      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodEnum) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldSelect)?.default

      const field: CmsFieldBase & CmsFieldSelect = {
        ...fieldBase,
        options: shapeBaseType._def.values,
        dropdown_threshold: 0,
        ...fieldCustom,
        default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
        widget: 'select'
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
  const bodyFieldIndex = fields.findIndex((f) => f.name === bodyFieldName)

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
  overrides?: Partial<CmsCollection>
): CmsCollection {
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
        fields: []
      }
    ]
  } else {
    cmsCollection.type = 'folder_based_collection'
    cmsCollection.folder = getCollectionFolder(basePath, pattern)
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

    if (['md', 'markdown'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.YAMLFrontmatter
    }

    if (['mdx'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.Frontmatter
    }
  }

  return merge(cmsCollection, overrides) as CmsCollection
}

function addCollectionFields(
  collection: Collection,
  cmsCollection: CmsCollection,
  cmsCollections: CmsCollection[]
) {
  const schema = getSchemaBaseType(collection.schema, {})

  if (!(schema instanceof z.ZodObject)) {
    throw new Error('Invalid schema provided, must be of type object')
  }

  if ('files' in cmsCollection) {
    cmsCollection.files![0]!.fields = sortSchemaFields(
      schemaToFields(schema, cmsCollection, cmsCollections)
    )
  } else {
    cmsCollection.fields = sortSchemaFields(
      schemaToFields(schema, cmsCollection, cmsCollections)
    )
  }
}

export function getCmsConfig(
  config: Config,
  options: Pick<Options, 'url' | 'repo' | 'collections' | 'cms'>
) {
  const basePath = relative(cwd(), config.root)

  const cmsCollections: CmsCollection[] = []

  for (const [name, collection] of Object.entries(config.collections)) {
    const collectionOptions = options.collections?.find((c) => c.name === name)
    const overrides = collectionOptions?.cms
      ? makeSparse(collectionOptions.cms)
      : undefined

    cmsCollections.push(
      createCmsCollection(basePath, name, collection, overrides)
    )
  }

  for (const [name, collection] of Object.entries(config.collections)) {
    const cmsCollection = cmsCollections.find((c) => c.name === name)
    if (!cmsCollection) {
      throw new Error(`Invalid collection name '${name}'`)
    }

    addCollectionFields(collection, cmsCollection, cmsCollections)
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
    collections: cmsCollections
  }

  return merge(cmsConfig, options.cms ? makeSparse(options.cms) : undefined)
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
