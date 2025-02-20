/* eslint-disable no-useless-escape */
'use client';

import prettierConfig from '../../../../.prettierrc.json';

const CMS = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js';

export default function AdminPage() {
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
    <link href="/cms-config.yml" type="text/yaml" rel="cms-config-url">
    <title>Content Manager</title>
  </head>
  <body>
    <script src="${CMS}"></script>
    <script type="importmap">
      {
        "imports": {
          "yaml": "https://esm.sh/yaml@2.7.0",
          "prettier": "https://esm.sh/prettier@3.4.2",
          "prettierMarkdown": "https://esm.sh/prettier@3.4.2/plugins/markdown.mjs"
        }
      }
    </script>
    <script type="module">
      import YAML from 'yaml'
      import prettier from 'prettier'
      import prettierMarkdown from 'prettierMarkdown'

      const prettierConfig = ${JSON.stringify(prettierConfig)}
      const delimiter = '---';

      const formatYAML = (frontmatter) => {
        return YAML.stringify(frontmatter, null, {
          lineWidth: 0,
          defaultKeyType: 'PLAIN',
          defaultStringType: 'PLAIN',
          singleQuote: false
        }).trim();
      }

      const formatContents = (body, frontmatter) => {
        body = body ? body + '\\n' : '';
        return delimiter + '\\n' + formatYAML(frontmatter) + '\\n' + delimiter + '\\n\\n' + body;
      }

      const formatter = async ({body, ...frontmatter}) => {
        const contents = formatContents(body, frontmatter)
        return prettier.format(contents, {
          parser: 'markdown',
          plugins: [prettierMarkdown],
          ...prettierConfig
        })
      }

      CMS.registerCustomFormat('yaml-frontmatter', 'md', {toFile: formatter});
      CMS.registerCustomFormat('frontmatter', 'mdx', {toFile: formatter});
    </script>
  </body>
</html>`,
      }}
    />
  );
}
