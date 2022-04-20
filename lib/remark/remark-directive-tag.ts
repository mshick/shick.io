import { h } from 'hastscript'
import type { Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { isDirective } from './types'

export default function remarkDirectiveTag(): Transformer {
  return (tree) => {
    visit(tree, (node) => {
      if (isDirective(node)) {
        const data = node.data || (node.data = {})
        const hast = h(node.name, node.attributes)

        data.hName = hast.tagName
        data.hProperties = hast.properties
      }
    })
  }
}
