import type { Transformer } from 'unified'
import type { ContainerDirective, LeafDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'
import { h } from 'hastscript'

const transform: Transformer = (tree) => {
  visit(
    tree,
    { name: 'footer' },
    (node: ContainerDirective | LeafDirective) => {
      if (node.type !== 'containerDirective' && node.type !== 'leafDirective') {
        return
      }

      const data = node.data || (node.data = {})
      const hast = h(node.name, node.attributes)

      data.hName = hast.tagName
      data.hProperties = hast.properties
    }
  )
}

export default function remarkBlockquote() {
  return transform
}
