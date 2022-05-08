import type { Parent, PhrasingContent } from 'mdast'
import type { Transformer } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import type { TreeNode } from './types'

function getTransformer(): Transformer {
  return (tree, file) => {
    visit(tree, { type: 'image' }, (node: TreeNode, index, parent: Parent) => {
      // Don't get images in an explicit figure container or that are inline
      if (parent.type !== 'containerDirective' && parent.type !== 'paragraph') {
        const wrapper = u(
          'figure',
          {
            data: {
              hName: 'figure'
            }
          },
          [node]
        ) as PhrasingContent

        parent.children.splice(index, 1, wrapper)
      }
    })
  }
}

export default function remmarkWrapImages() {
  return getTransformer()
}
