import { Directive } from 'mdast-util-directive'
import { Literal, Node, Parent } from 'unist'

export type TreeNode = Parent | Literal | Node

export function isLiteralNode(node: TreeNode): node is Literal {
  return Boolean((node as Literal).value)
}

export function isParentNode(node: TreeNode): node is Parent {
  return Boolean((node as Parent).children)
}

export function isNode(node: TreeNode): node is Node {
  return Boolean((node as Node).type)
}

export function isDirective(node: Node): node is Directive {
  return Boolean(
    (node.type === 'textDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'containerDirective') &&
      (node as Directive).name &&
      (node as Directive).children
  )
}
