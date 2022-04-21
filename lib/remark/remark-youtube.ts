import type { Parent, PhrasingContent } from 'mdast'
import type { Transformer } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import type { TreeNode } from './types'
import { isDirective } from './types'

function getTransformer(): Transformer {
  return (tree, file) => {
    visit(tree, (node: TreeNode, index, parent: Parent) => {
      if (isDirective(node)) {
        if (node.name !== 'youtube') {
          return
        }

        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}
        const id = attributes.id

        if (node.type === 'textDirective') {
          file.fail('Text directives for `youtube` not supported', node)
        }

        if (!id) {
          file.fail('Missing video id', node)
        }

        data.hName = 'iframe'
        data.hProperties = {
          src: 'https://www.youtube.com/embed/' + id,
          width: 853,
          height: 480,
          frameBorder: 0,
          allow: 'picture-in-picture',
          allowFullScreen: true
        }

        const wrapper = u(
          'iframeWrapper',
          {
            data: {
              hName: 'figure',
              hProperties: { className: [`iframe-wrapper`] }
            }
          },
          [node]
        ) as PhrasingContent

        parent.children.splice(index, 1, wrapper)
      }
    })
  }
}

export default function remarkYoutube() {
  return getTransformer()
}
