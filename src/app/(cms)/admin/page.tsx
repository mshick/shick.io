'use client'

const CMS_SCRIPT_SRC = 'https://unpkg.com/decap-cms@^3.1.10/dist/decap-cms.js'
// const CMS_SCRIPT_SRC = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js'

export default function AdminPage() {
  const config = {
    // local_backend: true,

    backend: {
      name: 'github',
      repo: 'mshick/shick.io',
      branch: 'main',
      // site_domain: 'new-shick-io.vercel.app',
      // base_url: 'https://new-shick-io.vercel.app',
      site_domain: 'localhost:1337',
      base_url: 'http://localhost:1337',
      auth_endpoint: 'oauth'
    },

    publish_mode: 'simple',
    media_folder: 'content/posts',
    public_folder: '/',
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
          { label: 'Date', name: 'date', widget: 'datetime', required: true },
          { label: 'Slug', name: 'slug', widget: 'string', required: false },
          { label: 'Draft', name: 'draft', widget: 'boolean', required: false },
          {
            label: 'Private',
            name: 'private',
            widget: 'boolean',
            required: false
          },
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
          { label: 'Date', name: 'date', widget: 'datetime', required: true },
          { label: 'Slug', name: 'slug', widget: 'string', required: false },
          { label: 'Draft', name: 'draft', widget: 'boolean', required: false },
          {
            label: 'Private',
            name: 'private',
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
                label: 'Repo URL Pattern',
                name: 'repoUrlPattern',
                widget: 'string',
                required: true
              },
              {
                label: 'Repo URL',
                name: 'repoUrl',
                widget: 'string',
                required: true
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
                label: 'Collection Paths',
                name: 'collectionPaths',
                widget: 'object',
                required: true,
                collapsed: true,
                fields: [
                  {
                    label: 'Pages',
                    name: 'pages',
                    widget: 'string',
                    required: false
                  },
                  {
                    label: 'Posts',
                    name: 'posts',
                    widget: 'string',
                    required: false
                  },
                  {
                    label: 'Tags',
                    name: 'tags',
                    widget: 'string',
                    required: false
                  },
                  {
                    label: 'Categories',
                    name: 'categories',
                    widget: 'string',
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

  return (
    <html
      suppressHydrationWarning
      lang="en"
      dangerouslySetInnerHTML={{
        __html: `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Content Manager</title>
  </head>
  <body>
    <script>
      window.CMS_MANUAL_INIT = true;
    </script>

    <script src="${CMS_SCRIPT_SRC}"></script>

    <script type="module">
      const config = ${JSON.stringify(config)};
      window.initCMS({ config });
    </script>
  </body>
</html>`
      }}
    />
  )
}
