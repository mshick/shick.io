import { getOptions } from '#/content'
import { devUrl, isLocal, isProduction } from '@/env'
import { NextResponse } from 'next/server'
import yaml from 'yaml'

const { url: siteUrl, repo } = getOptions(['url', 'repo'])

const url = new URL(isProduction ? siteUrl : devUrl)

const config = {
  local_backend: isLocal,
  backend: {
    name: repo.provider,
    repo: repo.name,
    branch: repo.branch,
    site_domain: url.host,
    base_url: url.origin,
    auth_endpoint: 'oauth'
  },
  publish_mode: 'simple',
  media_folder: 'content/posts',
  public_folder: '/static',
  show_preview_links: true,
  editor: {
    preview: false
  },
  collections: [
    {
      name: 'posts',
      label: 'Posts',
      label_singular: 'Post',
      folder: 'content/posts',
      create: true,
      media_folder: '',
      public_folder: '',
      meta: {
        path: {
          widget: 'string',
          label: 'Path',
          index_file: 'index'
        }
      },
      nested: {
        depth: 3
      },
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        {
          label: 'Date',
          name: 'date',
          widget: 'datetime',
          default: '{{now}}',
          required: true
        },
        { label: 'Slug', name: 'slug', widget: 'string', required: false },
        { label: 'Draft', name: 'draft', widget: 'boolean', required: false },
        {
          label: 'Featured',
          name: 'featured',
          widget: 'boolean',
          required: false
        },
        {
          label: 'Cover',
          name: 'cover',
          widget: 'object',
          allow_multiple: false,
          required: false,
          collapsed: true,
          fields: [
            {
              label: 'Image',
              name: 'image',
              widget: 'image',
              required: false
            },
            {
              label: 'Video',
              name: 'video',
              widget: 'string',
              required: false
            },
            {
              label: 'Title',
              name: 'title',
              widget: 'string',
              required: false
            },
            {
              label: 'Alt',
              name: 'alt',
              widget: 'string',
              required: false
            },
            {
              label: 'Caption',
              name: 'caption',
              widget: 'string',
              required: false
            }
          ]
        },
        {
          label: 'Meta',
          name: 'meta',
          widget: 'object',
          required: false,
          collapsed: true,
          fields: [
            {
              label: 'Title',
              name: 'title',
              widget: 'string',
              required: false
            },
            {
              label: 'Description',
              name: 'description',
              widget: 'text',
              required: false
            },
            {
              label: 'Keywords',
              name: 'keywords',
              widget: 'list',
              required: false
            }
          ]
        },
        {
          label: 'Excerpt',
          name: 'excerpt',
          widget: 'markdown',
          required: false
        },
        {
          label: 'Categories',
          name: 'categories',
          widget: 'list',
          required: false
        },
        {
          label: 'Tags',
          name: 'tags',
          widget: 'list',
          required: false
        },
        { label: 'Body', name: 'body', widget: 'markdown' }
      ]
    },
    {
      name: 'pages',
      label: 'Pages',
      label_singular: 'Page',
      folder: 'content/pages',
      extension: 'mdx',
      format: 'frontmatter',
      create: true,
      media_folder: '{{dirname}}',
      public_folder: '',
      meta: {
        path: {
          widget: 'string',
          label: 'Path',
          index_file: 'index'
        }
      },
      nested: {
        depth: 3
      },
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        {
          label: 'Date',
          name: 'date',
          widget: 'datetime',
          default: '{{now}}',
          required: true
        },
        { label: 'Slug', name: 'slug', widget: 'string', required: false },
        { label: 'Draft', name: 'draft', widget: 'boolean', required: false },
        {
          label: 'Cover',
          name: 'cover',
          widget: 'object',
          allow_multiple: false,
          required: false,
          collapsed: true,
          fields: [
            {
              label: 'Image',
              name: 'image',
              widget: 'image',
              required: false
            },
            {
              label: 'Video',
              name: 'video',
              widget: 'string',
              required: false
            },
            {
              label: 'Title',
              name: 'title',
              widget: 'string',
              required: false
            },
            {
              label: 'Alt',
              name: 'alt',
              widget: 'string',
              required: false
            },
            {
              label: 'Caption',
              name: 'caption',
              widget: 'string',
              required: false
            }
          ]
        },
        {
          label: 'Meta',
          name: 'meta',
          widget: 'object',
          required: false,
          collapsed: true,
          fields: [
            {
              label: 'Title',
              name: 'title',
              widget: 'string',
              required: false
            },
            {
              label: 'Description',
              name: 'description',
              widget: 'text',
              required: false
            },
            {
              label: 'Keywords',
              name: 'keywords',
              widget: 'list',
              required: false
            }
          ]
        },
        {
          label: 'Excerpt',
          name: 'excerpt',
          widget: 'markdown',
          required: false
        },
        {
          label: 'Categories',
          name: 'categories',
          widget: 'list',
          required: false
        },
        {
          label: 'Tags',
          name: 'tags',
          widget: 'list',
          required: false
        },
        { label: 'Body', name: 'body', widget: 'markdown' }
      ]
    },
    {
      name: 'site',
      label: 'Site',
      media_folder: '',
      public_folder: '',
      files: [
        {
          file: 'content/site/options.yml',
          name: 'options',
          label: 'Options',
          fields: [
            { label: 'Name', name: 'name', widget: 'string', required: true },
            {
              label: 'Title',
              name: 'title',
              widget: 'string',
              required: true
            },
            {
              label: 'Description',
              name: 'description',
              widget: 'text',
              required: true
            },
            {
              label: 'Locale',
              name: 'locale',
              widget: 'string',
              required: true
            },
            { label: 'URL', name: 'url', widget: 'string', required: true },
            {
              label: 'Keywords',
              name: 'keywords',
              widget: 'list',
              required: true
            },
            {
              label: 'Timezone',
              name: 'timezone',
              widget: 'string',
              required: true
            },
            {
              label: 'Repo',
              name: 'repo',
              widget: 'object',
              required: true,
              collapsed: true,
              fields: [
                {
                  label: 'Provider',
                  name: 'provider',
                  widget: 'select',
                  required: true,
                  options: ['github']
                },
                {
                  label: 'Name',
                  name: 'name',
                  widget: 'string',
                  required: true
                },
                {
                  label: 'Branch',
                  name: 'branch',
                  widget: 'string',
                  required: true,
                  default: 'main'
                }
              ]
            },
            {
              label: 'Author',
              name: 'author',
              widget: 'object',
              required: true,
              collapsed: true,
              fields: [
                {
                  label: 'Name',
                  name: 'name',
                  widget: 'string',
                  required: false
                },
                {
                  label: 'Email',
                  name: 'email',
                  widget: 'string',
                  required: false
                },
                {
                  label: 'URL',
                  name: 'url',
                  widget: 'string',
                  required: false
                }
              ]
            },
            {
              label: 'Links',
              name: 'links',
              widget: 'list',
              required: true,
              collapsed: true,
              fields: [
                {
                  label: 'Text',
                  name: 'text',
                  widget: 'string',
                  required: true
                },
                {
                  label: 'Path',
                  name: 'path',
                  widget: 'string',
                  required: true
                },
                {
                  label: 'Match',
                  name: 'match',
                  widget: 'string',
                  required: true
                },
                {
                  label: 'Type',
                  name: 'type',
                  widget: 'string',
                  required: true
                }
              ]
            },
            {
              label: 'Socials',
              name: 'socials',
              widget: 'list',
              required: true,
              collapsed: true,
              fields: [
                {
                  label: 'Name',
                  name: 'name',
                  widget: 'string',
                  required: true
                },
                {
                  label: 'Description',
                  name: 'description',
                  widget: 'string',
                  required: false
                },
                {
                  label: 'Link',
                  name: 'link',
                  widget: 'string',
                  required: false
                },
                {
                  label: 'Image',
                  name: 'image',
                  widget: 'image',
                  required: false
                },
                {
                  label: 'Icon',
                  name: 'icon',
                  widget: 'select',
                  required: false,
                  options: [
                    'x',
                    'github',
                    'whatsapp',
                    'signal',
                    'linkedin',
                    'email'
                  ]
                }
              ]
            },
            {
              label: 'Collections',
              name: 'collections',
              widget: 'list',
              required: true,
              collapsed: true,
              fields: [
                {
                  label: 'Name',
                  name: 'name',
                  widget: 'select',
                  required: true,
                  options: ['pages', 'posts', 'tags', 'categories']
                },
                {
                  label: 'Path',
                  name: 'path',
                  widget: 'string',
                  required: false
                },
                {
                  label: 'Pagination',
                  name: 'pagination',
                  widget: 'object',
                  fields: [
                    {
                      label: 'Per page',
                      name: 'perPage',
                      widget: 'number',
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

export function GET() {
  return new NextResponse(yaml.stringify(config))
}
