import type { Root } from 'mdast'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkMdx from 'remark-mdx'
// @ts-expect-error No typedefs
import remarkMdxRemoveImports from 'remark-mdx-remove-imports'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import remarkUnlink from 'remark-unlink'
import type { Transformer } from 'unified'
import { remove } from 'unist-util-remove'

function truncate(): Transformer<Root> {
  return (tree) => {
    let paragraphCount = 0

    remove(tree, { cascade: false }, (node, _index, parent) => {
      if (node.type === 'root') {
        return false
      }

      if (node.type === 'heading') {
        return true
      }

      if (
        parent?.type === 'root' &&
        node.type === 'paragraph' &&
        paragraphCount < 2
      ) {
        paragraphCount += 1
      }

      if (
        parent?.type === 'root' &&
        (node.type !== 'paragraph' || paragraphCount >= 2)
      ) {
        return true
      }

      return false
    })
  }
}

export async function remarkTruncate(body: string) {
  return remark()
    .use(remarkMdx)
    .use(remarkMdxRemoveImports)
    .use(remarkUnlink)
    .use(remarkSqueezeParagraphs)
    .use(truncate)
    .use(remarkHtml)
    .process(body)
}
