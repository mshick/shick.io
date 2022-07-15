import { h } from 'hastscript'
import { ContainerDirective, LeafDirective } from 'mdast-util-directive'
import { Transformer } from 'unified'
import { visit } from 'unist-util-visit'

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
