import { NextResponse } from 'next/server'
import { z } from 'zod'

function findBaseType(schema: z.ZodSchema<any>) {
  if (schema instanceof z.ZodEffects) {
    return findBaseType(schema.sourceType())
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return findBaseType(schema.unwrap())
  }

  if (schema instanceof z.ZodPipeline) {
    return findBaseType(schema._def.in)
  }

  if (schema instanceof z.ZodArray) {
    return findBaseType(schema.element)
  }

  if (schema instanceof z.ZodDefault) {
    return findBaseType(schema._def.innerType)
  }

  return schema
}

// {
//       label: 'Cover',
//       name: 'cover',
//       widget: 'object',
//       allow_multiple: false,
//       required: false,
//       collapsed: true,
//       fields: [
//         {
//           label: 'Image',
//           name: 'image',
//           widget: 'image',
//           required: false
//         },

function createDecapConfig(name: string, schema: z.ZodSchema<any>) {
  const object: Record<string, unknown> = {}

  const baseType = findBaseType(schema)

  if (baseType instanceof z.ZodObject) {
    object.name = name
    object.widget = 'object'

    const fields: Record<string, unknown>[] = []

    for (const fieldName in baseType.shape) {
      const objectField: Record<string, unknown> = {}

      const field = findBaseType(baseType.shape[fieldName])

      console.log({
        fieldName,
        // field,
        isString: field instanceof z.ZodString,
        isObject: field instanceof z.ZodObject
      })

      if (field instanceof z.ZodObject) {
        fields.push(createDecapConfig(fieldName, field))
      }

      if (field instanceof z.ZodNumber) {
        objectField.name = fieldName
        objectField.widget = 'number'
        objectField.required = !field.isOptional
      }

      if (field instanceof z.ZodString) {
        objectField.name = fieldName
        objectField.widget = 'string'
        objectField.required = !field.isOptional
      }

      fields.push(objectField)
    }

    object.fields = fields
  }

  return object
}

export function GET() {
  const count = z
    .object({ total: z.number(), posts: z.number(), pages: z.number() })
    .default({ total: 0, posts: 0, pages: 0 })

  const schema = z
    .object({
      name: z.string().max(20),
      // slug: z.slug('tags').optional(),
      // cover: cover.optional(),
      // excerpt: s.markdown({ gfm: false }).optional(),
      // date: z.isodate().optional(),
      // content: s.markdown(markdownOptions),
      count
    })
    // eslint-disable-next-line @typescript-eslint/require-await
    .transform(async (data) => {
      return {
        ...data
      }
    })

  const decapConfig = createDecapConfig('tag', schema)

  console.log(JSON.stringify(decapConfig, null, 2))

  return NextResponse.json(decapConfig)
}
