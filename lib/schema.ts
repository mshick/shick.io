import { s, type z } from 'velite';
import {
  DATETIME_WIDGET,
  IMAGE_WIDGET,
  MARKDOWN_WIDGET,
  RELATION_WIDGET,
} from './cms/constants';
import { publicRootPath } from './env';
import { DEFAULT_EXCERPT_LENGTH, excerptFn } from './excerpt';
import {
  createTaxonomyTransform,
  getContentPath,
  getEditUrl,
  getHistoryUrl,
  getPermalink,
  getShareUrl,
  getSlugFromPath,
  getUpdatedBy,
  getZonedDate,
} from './fields';
import { image } from './image';
import { markdownOptions } from './velite';

const icon = s.enum(['github', 'x', 'signal', 'linkedin', 'whatsapp', 'email']);

const cover = s.object({
  image: image({ publicRootPath, allowRemoteUrl: true })
    .optional()
    .describe(
      JSON.stringify({
        widget: IMAGE_WIDGET,
      }),
    ),
  title: s.string().optional(),
  alt: s.string().optional(),
  caption: s.string().optional(),
});

const count = s
  .object({ total: s.number(), post: s.number(), page: s.number() })
  .default({ total: 0, post: 0, page: 0 });

const meta = s.object({
  title: s.string().optional(),
  description: s.string().optional(),
  keywords: s.array(s.string()).optional(),
});

export const authors = s.object({
  name: s.string(),
  email: s.string().email(),
  url: s.string().url(),
});

export type Authors = z.infer<typeof authors>;

export const options = s.object({
  name: s.string().max(20),
  title: s.string().max(99),
  description: s.string().max(999),
  locale: s.string(),
  url: s.string(),
  keywords: s.array(s.string()),
  timezone: s.string(),
  repo: s.object({
    provider: s.enum(['github']),
    name: s.string(),
    branch: s.string().default('main'),
  }),
  author: s.object({
    name: s.string(),
    email: s.string().email(),
    url: s.string().url(),
  }),
  links: s.array(
    s.object({
      text: s.string(),
      path: s.string(),
      match: s.string(),
      type: s.enum(['navigation', 'footer', 'copyright']),
      current: s.boolean().default(false),
    }),
  ),
  socials: s.array(
    s.object({
      name: s.string(),
      description: s.string().optional(),
      icon,
      link: s.string(),
      image: s.image().optional(),
    }),
  ),
  cms: s
    .object({
      publish_mode: s.enum(['simple', 'editorial_workflow']),
      show_preview_links: s.boolean().default(true),
      locale: s.string().optional(),
      editor: s
        .object({
          preview: s.boolean().default(true),
        })
        .optional(),
      slug: s
        .object({
          encoding: s.enum(['unicode', 'ascii']),
          clean_accents: s.boolean().default(true),
          sanitize_replacement: s.string().optional(),
        })
        .optional(),
      i18n: s
        .object({
          structure: s.enum([
            'multiple_folders',
            'multiple_files',
            'single_file',
          ]),
          locales: s.array(s.string()).optional(),
          default_locale: s.string().optional(),
        })
        .optional(),
      automatic_deployments: s.boolean().default(true),
      output: s.object({
        omit_empty_optional_fields: s.boolean().default(true),
        json: s
          .object({
            indent_style: s.enum(['space', 'tab']),
            indent_size: s.number(),
          })
          .optional(),
        yaml: s
          .object({
            quote: s.enum(['single', 'double']),
            indent_size: s.number(),
          })
          .optional(),
      }),
    })
    .describe('Configuration overrides for the CMS')
    .optional(),
  collections: s
    .array(
      s.object({
        name: s.enum(['page', 'post', 'tag', 'category', 'author']),
        path: s.string().optional(),
        pagination: s
          .object({
            per_page: s.number(),
          })
          .optional(),
        cms: s
          .object({
            icon: s
              .string()
              .optional()
              .describe(
                '[Material Design icon name](https://fonts.google.com/icons?icon.set=Material+Symbols)',
              ),
            label: s.string().optional(),
            label_singular: s.string().optional(),
            description: s.string().optional(),
            identifier_field: s.string().optional(),
            summary: s.string().optional(),
            slug: s.string().optional(),
            preview_path: s.string().optional(),
            preview_path_date_field: s.string().optional(),
            create: s.boolean().optional().default(true),
            delete: s.boolean().optional().default(true),
            publish: s.boolean().optional().default(true),
            sortable_fields: s
              .object({
                fields: s.array(s.string()),
                default: s.object({
                  field: s.string(),
                  direction: s.enum(['ascending', 'descending']),
                }),
              })
              .optional(),
          })
          .optional(),
      }),
    )
    .optional(),
});

export type Options = z.infer<typeof options>;

const baseTag = s.object({
  name: s.string().max(20),
  cover: cover.optional(),
  excerpt: s.markdown().optional().describe(MARKDOWN_WIDGET),
  date: s.isodate().describe(DATETIME_WIDGET).optional(),
  body: s.markdown(markdownOptions).describe(MARKDOWN_WIDGET),
  count,
});

export const tag = baseTag.transform(createTaxonomyTransform('tag'));

export type BaseTag = z.infer<typeof baseTag>;
export type Tag = z.infer<typeof tag>;

export const baseCategory = s.object({
  name: s.string().max(20),
  cover: cover.optional(),
  excerpt: s.markdown().optional().describe(MARKDOWN_WIDGET),
  date: s.isodate().describe(DATETIME_WIDGET).optional(),
  body: s.markdown(markdownOptions).describe(MARKDOWN_WIDGET),
  count,
});

export const category = baseTag.transform(createTaxonomyTransform('category'));

export type BaseCategory = z.infer<typeof baseCategory>;
export type Category = z.infer<typeof category>;

export const post = s
  .object({
    __type: s.literal('post').default('post'),
    title: s.string().max(99),
    cover: cover.optional(),
    meta: meta.optional(),
    metadata: s.metadata(),
    body: s.markdown(markdownOptions).describe(MARKDOWN_WIDGET),
    excerpt: s.markdown().optional().describe(MARKDOWN_WIDGET),
    date: s.isodate().optional().describe(DATETIME_WIDGET),
    author: s
      .string()
      .optional()
      .describe(
        JSON.stringify({
          widget: RELATION_WIDGET,
          collection: 'author',
        }),
      ),
    draft: s.boolean().optional().default(false),
    toc: s.toc(),
    featured: s.boolean().optional().default(false),
    categories: s.array(s.string()).optional(),
    tags: s.array(s.string()).optional(),
    related: s
      .array(s.string())
      .optional()
      .describe(JSON.stringify({ widget: RELATION_WIDGET })),
  })
  .transform(async (data, ctx) => {
    const { meta } = ctx;
    const updatedBy = await getUpdatedBy(meta.path);
    const path = getContentPath(meta.config.root, meta.path);
    const slug = getSlugFromPath('post', path);
    const permalink = getPermalink('post', path, slug);

    return {
      ...data,
      excerpt: excerptFn({ format: 'text' }, data.excerpt, ctx),
      excerptHtml: excerptFn(
        { format: 'html', length: DEFAULT_EXCERPT_LENGTH + 40 },
        data.excerpt,
        ctx,
      ),
      slug,
      permalink,
      author: data.author ?? updatedBy?.latestAuthorName ?? '',
      shareUrl: getShareUrl(permalink),
      editUrl: getEditUrl(meta.path),
      historyUrl: getHistoryUrl(meta.path),
      updatedBy: updatedBy?.latestAuthorName ?? '',
      updatedByEmail: updatedBy?.latestAuthorEmail ?? '',
      publishedAt: getZonedDate(
        data.date ?? updatedBy?.latestDate ?? new Date(),
      ).toISOString(),
      updatedAt: getZonedDate(
        updatedBy?.latestDate ?? new Date(),
      ).toISOString(),
    };
  });

export type Post = z.infer<typeof post>;

export const page = s
  .object({
    __type: s.literal('page').default('page'),
    title: s.string().max(99),
    excerpt: s.markdown().describe(MARKDOWN_WIDGET),
    cover: cover.optional(),
    meta: meta.optional(),
    body: s
      .mdx({ gfm: false, copyLinkedFiles: false })
      .describe(MARKDOWN_WIDGET),
    categories: s.array(s.string()).optional(),
    tags: s.array(s.string()).optional(),
    draft: s.boolean().default(false),
    related: s.array(s.string()).optional(),
  })
  .transform(async (data, ctx) => {
    const { meta } = ctx;
    const updatedBy = await getUpdatedBy(meta.path);
    const path = getContentPath(meta.config.root, meta.path);
    const slug = getSlugFromPath('page', path);
    const permalink = getPermalink('page', path, slug);
    return {
      ...data,
      excerpt: excerptFn({ format: 'text' }, data.excerpt, ctx),
      excerptHtml: excerptFn(
        { format: 'html', length: DEFAULT_EXCERPT_LENGTH + 40 },
        data.excerpt,
        ctx,
      ),
      slug,
      permalink,
      shareUrl: getShareUrl(permalink),
      editUrl: getEditUrl(meta.path),
      historyUrl: getHistoryUrl(meta.path),
      publishedAt: getZonedDate(
        updatedBy?.latestDate ?? new Date(),
      ).toISOString(),
      updatedAt: getZonedDate(
        updatedBy?.latestDate ?? new Date(),
      ).toISOString(),
    };
  });

export type Page = z.infer<typeof page>;
