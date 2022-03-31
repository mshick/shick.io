import type { Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { h } from 'hastscript'

/**
 * Look for containerDirective
 * Search for all direct p children and wrap them in figcaption
 * Leave everything else alone
 */

const transform: Transformer = (tree, file) => {
  visit(tree, (node) => {
    if (
      node.type === 'textDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'containerDirective'
    ) {
      // if (node.name !== 'figure' && node.name !== 'figcaption') return
      console.log(node)

      const data = node.data || (node.data = {})
      const hast = h(node.name, node.attributes)

      console.log({ hast })
      data.hName = hast.tagName
      data.hProperties = hast.properties
    }
  })
}

export default function remarkFigure() {
  return transform
}
