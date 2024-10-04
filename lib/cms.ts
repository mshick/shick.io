import {
  CmsFieldBoolean,
  CmsFieldList,
  CmsFieldNumber,
  CmsFieldSelect,
  CmsFieldStringOrText,
  type CmsCollection,
  type CmsField,
  type CmsFieldBase,
  type CmsFieldDateTime,
  type CmsFieldMarkdown,
  type CmsFieldObject
} from '#/types/decap-cms'
import capitalize from 'lodash/capitalize.js'
import { dirname, join, relative } from 'node:path'
import { cwd } from 'node:process'
import { Collection, Config, z } from 'velite'
import { ENUM_MULTIPLE, ISODATE, MARKDOWN } from './schema'

type FieldAcc = Pick<CmsFieldBase, 'label' | 'name' | 'required'> & {
  default?: unknown
}

function findBaseType(
  schema: z.ZodSchema<any>,
  acc: { required?: boolean; default?: unknown }
) {
  if (schema instanceof z.ZodEffects) {
    return findBaseType(schema.sourceType(), acc)
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    acc.required = false
    return findBaseType(schema.unwrap(), acc)
  }

  if (schema instanceof z.ZodPipeline) {
    return findBaseType(schema._def.in, acc)
  }

  // if (schema instanceof z.ZodArray) {
  //   return findBaseType(schema.element, acc)
  // }

  if (schema instanceof z.ZodDefault) {
    acc.default = schema._def.defaultValue()
    return findBaseType(schema._def.innerType, acc)
  }

  if ('unwrap' in schema && typeof schema.unwrap === 'function') {
    // Default handler for any unwrappable type
    return findBaseType(schema.unwrap(), acc)
  }

  return schema
}

function convertObject(schema: z.ZodObject<any>) {
  const fields: CmsField[] = []

  for (const shapeName in schema.shape) {
    const fieldBase: FieldAcc = {
      label: capitalize(shapeName),
      name: shapeName,
      required: true
    }

    const shapeField = schema.shape[shapeName]
    const shapeBaseType = findBaseType(shapeField, fieldBase)

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
        max: shapeField._def.maxLength?.value ?? undefined,
        min: shapeField._def.minLength?.value ?? undefined
      }

      const arrayBaseType = findBaseType(shapeBaseType.element, {})

      if (arrayBaseType instanceof z.ZodObject) {
        field.fields = convertObject(arrayBaseType)
      }

      fields.push(field)
      continue
    }

    if (shapeBaseType instanceof z.ZodObject) {
      const field: CmsFieldBase & CmsFieldObject = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        widget: 'object',
        fields: convertObject(shapeBaseType)
      }
      fields.push(field)
      continue     
    }
    
    if (shapeBaseType instanceof z.ZodNumber) {
      const field: CmsFieldBase & CmsFieldNumber = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' || typeof fieldBase.default === 'number' ? fieldBase.default : undefined,
        widget: 'number',
        max: shapeBaseType.maxValue ?? undefined,
        min: shapeBaseType.minValue ?? undefined
      }
      fields.push(field)
      continue
    }
    
    if (shapeBaseType instanceof z.ZodString) {
      const maxValue = shapeBaseType._def.checks.find(c => c.kind === 'max')?.value ?? 0
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
          typeof fieldBase.default === 'boolean' ? fieldBase.default : undefined,
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

    console.log({
      fieldName: shapeName,
      field: shapeBaseType,
      description: shapeBaseType.description
    })
  }

  return fields
}

    // posts: { name: 'Post', pattern: 'posts/**/*.md', schema: [ZodEffects] },
    // pages: { name: 'Page', pattern: 'pages/**/*.mdx', schema: [ZodEffects] },
    // categories: {
    //   name: 'Category',
    //   pattern: 'categories/*.md',
    //   schema: [ZodEffects]
    // },
    // tags: { name: 'Tag', pattern: 'tags/*.md', schema: [ZodEffects] },
    // options: {
    //   name: 'Options',
    //   pattern: 'options.yml',
    //   single: true,
    //   schema: [ZodObject]
    // }

function createCmsCollection(basePath: string, name: string, collection: Collection) {
  const schema = findBaseType(collection.schema, {})

  if (!(schema instanceof z.ZodObject)) {
    throw new Error('Invalid schema provided, must be of type object')
  }

  const cmsCollection: Partial<CmsCollection> = {
    label: collection.name,
    name,
    media_folder: '',
    public_folder: ''
  }

  const pattern = Array.isArray(collection.pattern) ? collection.pattern[0] : collection.pattern
  if (!pattern) {
    throw new Error(`Invalid pattern in collection ${collection.name}`)
  }

  if (collection.single) {
    cmsCollection.type = 'file_based_collection'
    cmsCollection.files = [{
      file: pattern,
      name: pattern,
      label: pattern,
      fields: convertObject(schema)
    }]
  } else {
    cmsCollection.type = 'folder_based_collection'
    cmsCollection.folder = join(basePath, dirname(pattern))
    cmsCollection.fields = convertObject(schema)
    cmsCollection.create = true
  }

  return cmsCollection
}

// {
//   root: '/Users/mshick/Code/mshick/shick.io/content',
//   output: {
//     data: '/Users/mshick/Code/mshick/shick.io/.velite',
//     assets: '/Users/mshick/Code/mshick/shick.io/public/static',
//     base: '/static/',
//     name: '[name]-[hash:6].[ext]',
//     clean: true
//   },
//   collections: {
//     posts: { name: 'Post', pattern: 'posts/**/*.md', schema: [ZodEffects] },
//     pages: { name: 'Page', pattern: 'pages/**/*.mdx', schema: [ZodEffects] },
//     categories: {
//       name: 'Category',
//       pattern: 'categories/*.md',
//       schema: [ZodEffects]
//     },
//     tags: { name: 'Tag', pattern: 'tags/*.md', schema: [ZodEffects] },
//     options: {
//       name: 'Options',
//       pattern: 'options.yml',
//       single: true,
//       schema: [ZodObject]
//     }
//   },
//   mdx: {
//     remarkPlugins: [ [Function: remarkGemoji], [Object] ],
//     rehypePlugins: [ [Array], [Object] ]
//   },
//   prepare: [AsyncFunction: prepare],
//   complete: [AsyncFunction: complete],
//   configPath: '/Users/mshick/Code/mshick/shick.io/velite.config.ts',
//   configImports: [
//     '/Users/mshick/Code/mshick/shick.io/lib/excerpt.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/env.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/logger.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/git.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/options.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/fields.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/assets.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/velite.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/schema.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/cms.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/search.ts',
//     '/Users/mshick/Code/mshick/shick.io/lib/taxonomy.ts',
//     '/Users/mshick/Code/mshick/shick.io/velite.config.ts'
//   ],
//   cache: Map(3) {
//     'schemas:slug:posts:hello-world' => '/Users/mshick/Code/mshick/shick.io/content/posts/hello-world.md',
//     'schemas:slug:posts:tufte-css' => '/Users/mshick/Code/mshick/shick.io/content/posts/tufte-css.md',
//     'schemas:slug:posts:not-comitted' => '/Users/mshick/Code/mshick/shick.io/content/posts/uncommitted.md'
//   },
//   loaders: [
//     { test: /\.json$/, load: [Function: load] },
//     { test: /\.(yaml|yml)$/, load: [Function: load] },
//     { test: /\.(md|mdx)$/, load: [AsyncFunction: load] }
//   ],
//   strict: false
// }
export function getCmsConfig(config: Config) {
  const basePath = relative(cwd(), config.root)

  const cmsCollections = [];

  for (const [name, collection] of Object.entries(config.collections)) {
    cmsCollections.push(createCmsCollection(basePath, name, collection))
  }

  console.log(JSON.stringify(cmsCollections, null, 2))
}
