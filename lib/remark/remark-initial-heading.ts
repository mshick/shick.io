import { visitParents } from 'unist-util-visit-parents'

function addInitialHeading(node, ancestors) {
  const start = node
  const parent = ancestors[ancestors.length - 1]
  const startIndex = parent.children.indexOf(start)

  const heading = {
    type: 'heading',
    depth: 2,
    children: [
      {
        type: 'text',
        value: 'Introduction',
      },
    ],
    data: {
      hProperties: {
        className: 'hidden',
      },
    },
  }

  parent.children.splice(startIndex, 0, heading)
}

function transform(tree) {
  let foundHeading = false
  visitParents(
    tree,
    (node, _, parent) => {
      if (
        !foundHeading &&
        parent?.type === 'root' &&
        node.type !== 'mdxjsEsm' &&
        node.type !== 'yaml' &&
        node.type !== 'heading'
      ) {
        // first real element
        foundHeading = true
        return true
      }

      if (node.type === 'heading') {
        foundHeading = true
      }

      return false
    },
    addInitialHeading
  )
}

export default function remarkInitialHeading() {
  return transform
}
