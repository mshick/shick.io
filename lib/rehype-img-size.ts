import path from 'path'
import type { Node } from 'unist-util-visit'
import { visit } from 'unist-util-visit'
import sizeOf from 'image-size'

/**
 * Handles:
 * "//"
 * "http://"
 * "https://"
 * "ftp://"
 */
const absolutePathRegex = /^(?:[a-z]+:)?\/\//

function getImageSize(src: string, dir: string) {
  if (absolutePathRegex.exec(src)) {
    return
  }

  // Treat `/` as a relative path, according to the server
  const shouldJoin = !path.isAbsolute(src) || src.startsWith('/')

  if (dir && shouldJoin) {
    src = path.join(dir, src)
  }

  return sizeOf(src)
}

type ImportIdentifierMap = Record<string, string>

function collectImportIdentifiers(
  node,
  importIdentifierMap: ImportIdentifierMap
) {
  const importNodes = node.data.estree.body.filter(
    (n) => n.type === 'ImportDeclaration'
  )

  for (const importNode of importNodes) {
    for (const specifier of importNode.specifiers) {
      if (
        specifier.type === 'ImportDefaultSpecifier' &&
        specifier.local.type === 'Identifier'
      ) {
        importIdentifierMap[specifier.local.name] = importNode.source.value
      }
    }
  }
}

interface ImgNode extends Node {
  attributes?: {
    type: string
    name: string
    value?: { value?: string } | string
  }[]
}

function addSizeAttributes(
  node: ImgNode,
  importIdentifierMap: ImportIdentifierMap,
  dir
): void {
  const srcNode = node.attributes?.find((attr) => attr.name === 'src')
  if (typeof srcNode?.value === 'object') {
    const srcIdentifier = srcNode?.value?.value
    if (srcIdentifier) {
      const src = importIdentifierMap[srcIdentifier]
      if (src) {
        const dimensions = getImageSize(src, dir)

        if (dimensions.height) {
          node.attributes.push({
            type: 'mdxJsxAttribute',
            name: 'height',
            value: String(dimensions.height),
          })
        }

        if (dimensions.width) {
          node.attributes.push({
            type: 'mdxJsxAttribute',
            name: 'width',
            value: String(dimensions.width),
          })
        }

        if (dimensions.type) {
          node.attributes.push({
            type: 'mdxJsxAttribute',
            name: 'type',
            value: dimensions.type,
          })
        }
      }
    }
  }
}

function createImageSizeTransformer(dir: string) {
  const importIdentifierMap: ImportIdentifierMap = {}

  return function transformer(tree: Node) {
    visit(tree, ['mdxjsEsm', 'mdxJsxTextElement'], (node) => {
      if (node.type === 'mdxjsEsm') {
        collectImportIdentifiers(node, importIdentifierMap)
      }

      // @ts-expect-error
      if (node.type === 'mdxJsxTextElement' && node.name === 'img') {
        addSizeAttributes(node, importIdentifierMap, dir)
      }
    })

    return tree
  }
}

export default function rehypeImgSize(options) {
  return createImageSizeTransformer(options?.dir ?? '')
}
