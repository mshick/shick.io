import path from 'path'
import { visit } from 'unist-util-visit'
import sizeOf from 'image-size'

export default setImageSize

/**
 * Handles:
 * "//"
 * "http://"
 * "https://"
 * "ftp://"
 */
const absolutePathRegex = /^(?:[a-z]+:)?\/\//

function getImageSize(src, dir) {
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

function collectImports(node, imports) {
  const importNodes = node.data.estree.body.filter(
    (n) => n.type === 'ImportDeclaration'
  )

  for (const importNode of importNodes) {
    for (const specifier of importNode.specifiers) {
      if (
        specifier.type === 'ImportDefaultSpecifier' &&
        specifier.local.type === 'Identifier'
      ) {
        imports.push({
          source: importNode.source.value,
          identifier: specifier.local.name,
        })
      }
    }
  }
}

function setImageSize(options) {
  const opts = options || {}
  const dir = opts.dir
  return transformer

  function transformer(tree, file) {
    // console.log('CUSTOM setImage', JSON.stringify(tree))

    const imports = []

    visit(tree, 'mdxjsEsm', (node) => {
      collectImports(node, imports)
    })

    visit(tree, 'mdxJsxTextElement', (node) => {
      if (node.name === 'img') {
        const srcNode = node.attributes.find((attr) => attr.name === 'src')
        const srcIdentifier = srcNode?.value?.value
        if (srcIdentifier) {
          const im = imports.find((imp) => imp.identifier === srcIdentifier)
          const src = im?.source
          if (src) {
            const dimensions = getImageSize(src, dir) || {}
            node.attributes.push({
              type: 'mdxJsxAttribute',
              name: 'height',
              value: dimensions.height,
            })
            node.attributes.push({
              type: 'mdxJsxAttribute',
              name: 'width',
              value: dimensions.width,
            })
            node.attributes.push({
              type: 'mdxJsxAttribute',
              name: 'type',
              value: dimensions.type,
            })
          }
        }
      }
    })
  }
}
