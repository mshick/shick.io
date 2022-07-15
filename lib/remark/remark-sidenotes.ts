import {
  FootnoteDefinition,
  FootnoteReference,
  Parent,
  PhrasingContent
} from 'mdast'
import { Transformer } from 'unified'
import { u } from 'unist-builder'
import { select } from 'unist-util-select'
import { visit } from 'unist-util-visit'

// Need to use the unicode escape sequence for ⊕ / Circled Plus due to later sanitization
const MARGINNOTE_LABEL = `\u2295`

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
  marginnoteLabel
}): PhrasingContent {
  const inputId = generateInputId(isMarginNote, identifier, referenceCount)
  const labelCls = `margin-toggle ${isMarginNote ? '' : 'sidenote-number'}`
  const labelSymbol = isMarginNote ? marginnoteLabel : ''
  const noteTypeCls = isMarginNote ? 'marginnote' : 'sidenote'

  return u(
    noteTypeCls,
    { data: { hName: 'span', hProperties: { className: [noteTypeCls] } } },
    [
      u(
        `${noteTypeCls}Reference`,
        {
          identifier,
          data: {
            hName: 'label',
            hProperties: { for: inputId, className: [labelCls] }
          }
        },
        [u('text', labelSymbol)]
      ) as PhrasingContent,
      u(`${noteTypeCls}Toggle`, {
        identifier,
        data: {
          hName: 'input',
          hProperties: {
            type: 'checkbox',
            id: inputId,
            className: ['margin-toggle']
          }
        }
      }) as unknown as PhrasingContent,
      u(
        `${noteTypeCls}Definition`,
        {
          identifier,
          data: {
            hName: 'span',
            hProperties: { className: [`${noteTypeCls}-definition`] }
          }
        },
        notesAst
      ) as PhrasingContent
    ]
  ) as PhrasingContent
}

function getTransformer(settings): Transformer {
  return (tree) => {
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
          `footnoteDefinition[identifier=${identifier}]`,
          tree
        ) as FootnoteDefinition

        if (!target) {
          throw new Error('No coresponding note found')
        }

        const isMarginNote = !isNumericString(identifier)

        const notesAst =
          target.children.length && target.children[0].type === 'paragraph'
            ? target.children[0].children
            : target.children

        parent.children.splice(
          index,
          1,
          getReplacement({
            isMarginNote,
            notesAst,
            identifier,
            referenceCount,
            ...settings
          })
        )
      }
    )

    visit(tree, 'footnoteDefinition', (_node, index, parent: Parent) => {
      parent.children.splice(index, 1)
    })

    // "Inline" Sidenotes which do not have two parts
    // Syntax: [^ <markdown>]
    visit(
      tree,
      'footnote',
      (node: FootnoteDefinition, index, parent: Parent) => {
        const { identifier } = node
        const isMarginNote = !isNumericString(identifier)
        const notesAst = node.children
        parent.children.splice(
          index,
          1,
          getReplacement({
            isMarginNote,
            notesAst,
            identifier,
            referenceCount,
            ...settings
          })
        )
      }
    )

    // Only for testing
    return tree
  }
}

export default function remarkSidenotes(
  options = { marginnoteLabel: MARGINNOTE_LABEL }
) {
  const settings = {
    marginnoteLabel: options.marginnoteLabel || MARGINNOTE_LABEL
  }

  return getTransformer(settings)
}
