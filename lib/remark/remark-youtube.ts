import { Parent, PhrasingContent } from 'mdast'
import { Transformer } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { isDirective, TreeNode } from './types'

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
          frameBorder: 0,
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowFullScreen: true
        }

        const wrapper = u(
          'iframeFigure',
          {
            data: {
              hName: 'figure',
              hProperties: { className: ['iframe', 'youtube'] }
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
