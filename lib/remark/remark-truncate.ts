import { Transformer } from 'unified'
import { remove } from 'unist-util-remove'

function transform(tree) {
  let paragraphCount = 0

  const filter = (node, _index, parent) => {
    if (node.type === 'root') {
      return false
    }

    if (node.type === 'heading') {
      return true
    }

    if (
      parent?.type === 'root' &&
      node.type === 'paragraph' &&
      paragraphCount < 2
    ) {
      paragraphCount += 1
    }

    if (
      parent?.type === 'root' &&
      (node.type !== 'paragraph' || paragraphCount >= 2)
    ) {
      return true
    }

    return false
  }

  return remove(tree, { cascade: false }, filter)
}

export default function remarkTruncate(): Transformer {
  return transform
}
