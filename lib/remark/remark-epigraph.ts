import type { Transformer } from 'unified'
import type { Node } from 'unist'
import type { BlockContent } from 'mdast'
import { isParentNode } from './types'
import { visit } from 'unist-util-visit'

/**
 * Find sections, from remark-sectionize, and then mark blockquotes that
 * are the first children after any headings.
 */
const transform: Transformer = (tree) => {
  visit(tree, { type: 'section' }, (node: Node) => {
    if (!isParentNode(node)) {
      return
    }

    let nonBlockquoteFound = false

    const epigraphNodes = node.children.filter((child) => {
      if (nonBlockquoteFound) {
        return false
      }

      if (child.type === 'heading') {
        return false
      }

      if (child.type === 'blockquote') {
        return true
      }

      nonBlockquoteFound = true

      return false
    }) as BlockContent[]

    if (epigraphNodes.length) {
      const startIndex = node.children.indexOf(epigraphNodes[0])

      const epigraph: BlockContent = {
        type: 'containerDirective',
        name: 'epigraph',
        children: epigraphNodes,
        data: {
          hName: 'div',
          hProperties: {
            className: ['epigraph'],
          },
        },
      }

      node.children.splice(startIndex, epigraph.children.length, epigraph)
    }
  })
}

export default function remarkEpigraph() {
  return transform
}
