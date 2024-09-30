import rehypePresetTufted from '@mshick/tufted/rehype'
import remarkPresetTufted from '@mshick/tufted/remark'
import type { ElementContent, Root as Hast } from 'hast'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import type { Root as Mdast } from 'mdast'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { PluggableList } from 'unified'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { MarkdownOptions, rehypeCopyLinkedFiles, z } from 'velite'

declare module 'hast' {
  interface Data {
    meta?: string
  }
}

const remarkRemoveComments = () => (tree: Mdast) => {
  visit(tree, 'html', (node, index, parent) => {
    if (node.value.match(/<!--([\s\S]*?)-->/g)) {
      parent!.children.splice(index!, 1)
      return ['skip', index] // https://unifiedjs.com/learn/recipe/remove-node/
    }

    return
  })
}

const rehypeMetaString = () => (tree: Hast) => {
  visit(tree, 'element', (node) => {
    if (node.tagName === 'code' && node.data?.meta) {
      node.properties ??= {}
      node.properties['metastring'] = node.data.meta
    }
  })
}

type Options = MarkdownOptions & {
  tufted?: boolean
}

export const markdown = (options: Options = {}) =>
  z
    .custom<string | undefined>((i) => i === undefined || typeof i === 'string')
    .transform<string>(async (value, { meta, addIssue }) => {
      value = value ?? meta.content
      if (value == null || value.length === 0) {
        addIssue({ code: 'custom', message: 'The content is empty' })
        return ''
      }

      const { output } = meta.config

      const enableGfm = options.gfm ?? true
      const enableTufted = options.tufted ?? true
      const removeComments = options.removeComments ?? true
      const copyLinkedFiles = options.copyLinkedFiles ?? true

      const remarkPlugins = [] as PluggableList
      const rehypePlugins = [] as PluggableList

      // support gfm (autolink literals, footnotes, strikethrough, tables, tasklists).
      if (enableGfm) {
        remarkPlugins.push(remarkGfm)
      }

      // remove html comments
      if (removeComments) {
        remarkPlugins.push(remarkRemoveComments)
      }

      // copy linked files to public path and replace their urls with public urls
      if (copyLinkedFiles) {
        rehypePlugins.push([rehypeCopyLinkedFiles, output])
      }

      // apply remark plugins
      if (enableTufted) {
        remarkPlugins.push(remarkPresetTufted())

        const rehypeTufted = rehypePresetTufted({
          assets: 'public/static',
          base: '/static/',
          plugins: {
            rehypeShiki: {
              themes: {
                light: 'one-light',
                dark: 'one-dark-pro'
              }
            },
            rehypeAutolinkHeadings: {
              behavior: 'append',
              content: fromHtmlIsomorphic('#', {
                fragment: true
              }).children as ElementContent[],
              headingProperties: {
                className: ['group']
              },
              properties: {
                className: [
                  'heading-link',
                  'hidden',
                  'group-hover:inline-block',
                  'ml-2'
                ]
              }
            }
          }
        })

        rehypePlugins.push(rehypeTufted)
      }

      try {
        const html = await unified()
          .use(remarkParse) // parse markdown content to a syntax tree
          .use(remarkPlugins) // apply remark plugins
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeMetaString) // ensure `data.meta` is preserved in `properties.metastring` for rehype syntax highlighters
          .use(rehypeRaw) // turn markdown syntax tree to html syntax tree, with raw html support
          .use(rehypePlugins) // apply rehype plugins
          .use(rehypeStringify) // serialize html syntax tree
          .process({ value, path: meta.path })
        return html.toString()
      } catch (err: any) {
        addIssue({ fatal: true, code: 'custom', message: err.message })
        return null as never
      }
    })
