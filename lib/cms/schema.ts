import isPlainObject from 'lodash/isPlainObject.js';
import { z } from 'velite';
import {
  BODY_FIELD_NAME,
  DATETIME_WIDGET,
  IMAGE_WIDGET,
  MARKDOWN_WIDGET,
  RELATION_WIDGET,
  VELITE_FIELDS,
} from './constants';
import type {
  CmsCollection,
  CmsField,
  CmsFieldBase,
  CmsFieldBoolean,
  CmsFieldDateTime,
  CmsFieldFileOrImage,
  CmsFieldList,
  CmsFieldMarkdown,
  CmsFieldNumber,
  CmsFieldObject,
  CmsFieldRelation,
  CmsFieldSelect,
  CmsFieldStringOrText,
} from './types';
import { safeParseJsonString } from './util';

type FieldAcc = Pick<
  CmsFieldBase,
  'label' | 'name' | 'required' | 'comment'
> & {
  default?: unknown;
};

export function getSchemaBaseType(
  schema: z.ZodSchema<any>,
  acc: { required?: boolean; default?: unknown },
) {
  if (schema instanceof z.ZodEffects) {
    return getSchemaBaseType(schema.sourceType(), acc);
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    acc.required = false;
    return getSchemaBaseType(schema.unwrap(), acc);
  }

  if (schema instanceof z.ZodPipeline) {
    return getSchemaBaseType(schema._def.in, acc);
  }

  if (schema instanceof z.ZodDefault) {
    acc.default = schema._def.defaultValue();
    return getSchemaBaseType(schema._def.innerType, acc);
  }

  if ('unwrap' in schema && typeof schema.unwrap === 'function') {
    // Default handler for any unwrappable type
    return getSchemaBaseType(schema.unwrap(), acc);
  }

  return schema;
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
        'hidden',
      ])
      .optional(),
    name: z.string().optional(),
  })
  .passthrough();

function getFieldCustom(description: string): Partial<CmsField> | undefined {
  const maybeJson = safeParseJsonString(description);

  if (typeof maybeJson === 'string') {
    return cmsField.safeParse({ widget: maybeJson }).data;
  }

  if (isPlainObject(maybeJson)) {
    return cmsField.safeParse(maybeJson).data;
  }

  return;
}

export function schemaToFields(
  schema: z.ZodObject<any>,
  collection: Pick<CmsCollection, 'name' | 'identifier_field'>,
  collections: Pick<CmsCollection, 'name' | 'identifier_field'>[],
) {
  const fields: CmsField[] = [];

  for (const shapeName in schema.shape) {
    const fieldBase: FieldAcc = {
      name: shapeName,
      required: true,
    };

    const shapeField = schema.shape[shapeName];
    const shapeBaseType = getSchemaBaseType(shapeField, fieldBase);

    const fieldCustom = getFieldCustom(shapeField.description);

    if (fieldCustom?.widget === MARKDOWN_WIDGET) {
      const field: CmsFieldBase & CmsFieldMarkdown = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        ...fieldCustom,
        widget: fieldCustom.widget,
      };
      fields.push(field);
      continue;
    }

    if (fieldCustom?.widget === DATETIME_WIDGET) {
      const field: CmsFieldBase & CmsFieldDateTime = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        ...fieldCustom,
        widget: fieldCustom.widget,
      };
      fields.push(field);
      continue;
    }

    if (fieldCustom?.widget === IMAGE_WIDGET) {
      const field: CmsFieldBase & CmsFieldFileOrImage = {
        ...fieldBase,
        default:
          typeof fieldBase.default === 'string' ? fieldBase.default : undefined,
        ...fieldCustom,
        widget: fieldCustom.widget,
      };
      fields.push(field);
      continue;
    }

    if (fieldCustom?.widget === RELATION_WIDGET) {
      const defaultVal =
        Array.isArray(fieldBase.default) ||
        typeof fieldBase.default === 'string'
          ? fieldBase.default
          : undefined;

      const collectionName =
        (fieldCustom as CmsFieldRelation)?.collection ?? collection.name;
      const relationCollection = collections.find(
        (c) => c.name === collectionName,
      );

      if (!relationCollection) {
        throw new Error(`Invalid collection name '${collectionName}'`);
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
            : 'title',
        ],
        dropdown_threshold: 0,
        ...fieldCustom,
        widget: fieldCustom.widget,
      };

      fields.push(field);
      continue;
    }

    fieldBase.comment = shapeField.description;

    if (shapeBaseType instanceof z.ZodArray) {
      const field: CmsFieldBase & CmsFieldList = {
        ...fieldBase,
        collapsed: true,
        max: shapeField._def.maxLength?.value ?? undefined,
        min: shapeField._def.minLength?.value ?? undefined,
        ...fieldCustom,
        widget: 'list',
      };

      const arrayBaseType = getSchemaBaseType(shapeBaseType.element, {});

      if (arrayBaseType instanceof z.ZodObject) {
        field.fields = schemaToFields(arrayBaseType, collection, collections);
      }

      fields.push(field);
      continue;
    }

    if (shapeBaseType instanceof z.ZodObject) {
      const objectFields = schemaToFields(
        shapeBaseType,
        collection,
        collections,
      );
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldStringOrText)?.default;

      if (objectFields.length) {
        const field: CmsFieldBase & CmsFieldObject = {
          ...fieldBase,
          fields: objectFields,
          collapsed: true,
          ...fieldCustom,
          default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
          widget: 'object',
        };
        fields.push(field);
      } else {
        const field: CmsFieldBase & CmsFieldStringOrText = {
          ...fieldBase,
          ...fieldCustom,
          default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
          widget: 'string',
        };
        fields.push(field);
      }

      continue;
    }

    if (shapeBaseType instanceof z.ZodNumber) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldNumber)?.default;

      const field: CmsFieldBase & CmsFieldNumber = {
        ...fieldBase,
        max: shapeBaseType.maxValue ?? undefined,
        min: shapeBaseType.minValue ?? undefined,
        ...fieldCustom,
        default:
          typeof fieldDefault === 'string' || typeof fieldDefault === 'number'
            ? fieldDefault
            : undefined,
        widget: 'number',
      };
      fields.push(field);
      continue;
    }

    if (shapeBaseType instanceof z.ZodString) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldStringOrText)?.default;

      const maxValue =
        shapeBaseType._def.checks.find((c) => c.kind === 'max')?.value ?? 0;
      const field: CmsFieldBase & CmsFieldStringOrText = {
        ...fieldBase,
        ...fieldCustom,
        default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
        widget: maxValue > 120 ? 'text' : 'string',
      };
      fields.push(field);
      continue;
    }

    if (shapeBaseType instanceof z.ZodBoolean) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldBoolean)?.default;

      const field: CmsFieldBase & CmsFieldBoolean = {
        ...fieldBase,
        ...fieldCustom,
        default: typeof fieldDefault === 'boolean' ? fieldDefault : undefined,
        widget: 'boolean',
      };
      fields.push(field);
      continue;
    }

    if (shapeBaseType instanceof z.ZodEnum) {
      const fieldDefault =
        fieldBase.default ?? (fieldCustom as CmsFieldSelect)?.default;

      const field: CmsFieldBase & CmsFieldSelect = {
        ...fieldBase,
        options: shapeBaseType._def.values,
        dropdown_threshold: 0,
        ...fieldCustom,
        default: typeof fieldDefault === 'string' ? fieldDefault : undefined,
        widget: 'select',
      };
      fields.push(field);
      continue;
    }

    if (shapeBaseType instanceof z.ZodLiteral) {
      // Do nothing
      continue;
    }

    if (
      shapeBaseType instanceof z.ZodAny &&
      VELITE_FIELDS.includes(shapeName)
    ) {
      // Do nothing
      continue;
    }

    console.log('unhandled field', {
      fieldName: shapeName,
      field: shapeBaseType,
      description: shapeBaseType.description,
    });
  }

  return fields;
}

export function sortSchemaFields(fields: CmsField[]) {
  const bodyFieldIndex = fields.findIndex((f) => f.name === BODY_FIELD_NAME);

  if (bodyFieldIndex > -1) {
    fields.push(fields.splice(bodyFieldIndex, 1)[0]!);
  }

  return fields;
}
