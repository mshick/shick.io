import type { Transformer } from 'unified'
import type { TextDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'

const transform: Transformer = (tree) => {
  visit(
    tree,
    { type: 'textDirective', name: 'newthought' },
    (node: TextDirective) => {
      const data = node.data || (node.data = { hProperties: {} })
      data.hName = 'span'
      data.hProperties = {
        ...(data.hProperties as {}),
        className: ['newthought']
      }
    }
  )
}

export default function remarkNewthought() {
  return transform
}
