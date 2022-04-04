import type {
  PhrasingContent,
  Parent,
  FootnoteReference,
  FootnoteDefinition,
  Content,
} from 'mdast'
import type { Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import select from 'unist-util-select'
import { u } from 'unist-builder'

function isNumericString(key: string): boolean {
  return !isNaN(Number(key))
}

function generateInputId(isMarginNote, identifier, referenceCount) {
  return `${isMarginNote ? 'mn' : 'sn'}-${identifier}-${referenceCount}`
}

function getReplacement({
  isMarginNote,
  notesAst,
  identifier,
  referenceCount,
}): Content[] {
  const inputId = generateInputId(isMarginNote, identifier, referenceCount)
  const labelCls = `margin-toggle ${isMarginNote ? '' : 'sidenote-number'}`
  const labelSymbol = isMarginNote ? '&#8853;' : ''
  const noteTypeCls = isMarginNote ? 'marginnote' : 'sidenote'

  return [
    u(
      'sidenoteReference',
      {
        identifier,
        data: {
          hName: 'label',
          hProperties: { for: inputId, className: [labelCls] },
        },
      },
      [u('text', labelSymbol)]
    ) as unknown as PhrasingContent,
    u('sidenoteToggle', {
      identifier,
      data: {
        hName: 'input',
        hProperties: {
          type: 'checkbox',
          id: inputId,
          className: ['margin-toggle'],
        },
      },
    }) as unknown as PhrasingContent,
    u(
      'sidenoteDefinition',
      {
        identifier,
        data: { hName: 'span', hProperties: { className: [noteTypeCls] } },
      },
      notesAst
    ) as unknown as PhrasingContent,
  ]
}

const transformer: Transformer = (tree) => {
  let referenceCount = 0

  // "Regular" Sidenotes/Marginnotes consisting of a reference and a definition
  // Syntax for Sidenotes [^<number>] and somewhere else [^<number>]: <markdown>
  // Syntax for Marginnotes [^<string>] and somewhere else [^<string>]: <markdown>
  visit(
    tree,
    'footnoteReference',
    (node: FootnoteReference, index, parent: Parent) => {
      referenceCount += 1

      const { identifier } = node

      const target = select(
        tree,
        `footnoteDefinition[identifier=${identifier}]`
      )

      if (!target.length) {
        throw new Error('No coresponding note found')
      }

      const isMarginNote = !isNumericString(identifier)

      const notesAst =
        target[0].children.length && target[0].children[0].type === 'paragraph'
          ? target[0].children[0].children
          : target[0].children

      parent.children.splice(
        index,
        1,
        ...getReplacement({
          isMarginNote,
          notesAst,
          identifier,
          referenceCount,
        })
      )
    }
  )

  visit(tree, 'footnoteDefinition', (_node, index, parent: Parent) => {
    parent.children.splice(index, 1)
  })

  // "Inline" Sidenotes which do not have two parts
  // Syntax: [^ <markdown>]
  visit(tree, 'footnote', (node: FootnoteDefinition, index, parent: Parent) => {
    const { identifier } = node
    const isMarginNote = !isNumericString(identifier)
    const notesAst = node.children
    parent.children.splice(
      index,
      1,
      ...getReplacement({ isMarginNote, notesAst, identifier, referenceCount })
    )
  })

  // Only for testing
  return tree
}

export default function remarkSidenotes() {
  return transformer
}
