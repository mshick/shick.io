import type { Metadata } from 'next';
import Script from 'next/script';
import prettierConfig from '~/.prettierrc.json';

export const metadata: Metadata = {
  robots: 'noindex',
};

export default function AdminPage() {
  const env =
    process.env.VERCEL === '1'
      ? process.env.VERCEL_ENV === 'production'
        ? 'production'
        : 'development'
      : 'local';

  const cmsUrl = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js';
  const configUrl = `/admin/${env}/config.json`;

  return (
    <>
      <Script id="importmap" type="importmap">{`
        {
          "imports": {
            "yaml": "https://esm.sh/yaml@2.7.0",
            "prettier": "https://esm.sh/prettier@3.4.2",
            "prettierMarkdown": "https://esm.sh/prettier@3.4.2/plugins/markdown.mjs"
          }
        }
      `}</Script>
      <Script id="cms" type="module">{`
        import YAML from 'yaml';
        import prettier from 'prettier';
        import prettierMarkdown from 'prettierMarkdown';

        const prettierConfig = ${JSON.stringify(prettierConfig)}
        const delimiter = '---';

        const makeSparse = (obj) => {
          return JSON.parse(
            JSON.stringify(obj, (_key, value) => {
              return value === null || value === '' ? undefined : value;
            }),
          );
        }

        const formatYAML = (frontmatter) => {
          return YAML.stringify(makeSparse(frontmatter), null, {
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

        const link = document.createElement('link');
        link.rel = 'cms-config-url';
        link.type = 'application/json';
        link.href = '${configUrl}';
        document.head.appendChild(link);

        function registerCustomFormats() {
          console.log('Registering custom formats');
          CMS.registerCustomFormat('yaml-frontmatter', 'md', {toFile: formatter});
          CMS.registerCustomFormat('frontmatter', 'mdx', {toFile: formatter});        
        }

        const script = document.createElement('script');
        script.src = '${cmsUrl}';
        script.onload = registerCustomFormats;
        document.head.appendChild(script);
      `}</Script>
    </>
  );
}
