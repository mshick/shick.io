import aspectRatio from '@tailwindcss/aspect-ratio'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import parser, { type Pseudo } from 'postcss-selector-parser'
import plugin from 'tailwindcss/plugin'
import { type Config, type PluginAPI } from 'tailwindcss/types/config'

const parseSelector = parser()

function commonTrailingPseudos(selector: string) {
  const ast = parseSelector.astSync(selector)

  const matrix: Pseudo[][] = []

  // Put the pseudo elements in reverse order in a sparse, column-major 2D array
  for (const [i, sel] of ast.nodes.entries()) {
    for (const [j, child] of [...sel.nodes].reverse().entries()) {
      // We only care about pseudo elements
      if (child.type !== 'pseudo' || !child.value.startsWith('::')) {
        break
      }

      matrix[j] = matrix[j] ?? []
      matrix[j][i] = child
    }
  }

  // @ts-expect-error
  const trailingPseudos = parser.selector()

  // At this point the pseudo elements are in a column-major 2D array
  // This means each row contains one "column" of pseudo elements from each selector
  // We can compare all the pseudo elements in a row to see if they are the same
  for (const pseudos of matrix) {
    // It's a sparse 2D array so there are going to be holes in the rows
    // We skip those
    if (!pseudos) {
      continue
    }

    const values = new Set([...pseudos.map((p) => p.value)])

    // The pseudo elements are not the same
    if (values.size > 1) {
      break
    }

    pseudos.forEach((pseudo) => pseudo.remove())

    // @ts-expect-error
    trailingPseudos.prepend(pseudos[0])
  }

  if (trailingPseudos.nodes.length) {
    return [trailingPseudos.toString(), ast.toString()]
  }

  return [null, selector]
}

function inWhere(
  selector: string,
  {
    className,
    modifier,
    prefix
  }: { className: string; modifier: string; prefix: (name: string) => string }
) {
  const prefixedNot = prefix(`.not-${className}`).slice(1)
  const selectorPrefix = selector.startsWith('>')
    ? `${modifier === 'DEFAULT' ? `.${className}` : `.${className}-${modifier}`} `
    : ''

  // Parse the selector, if every component ends in the same pseudo element(s) then move it to the end
  const [trailingPseudo, rebuiltSelector] = commonTrailingPseudos(selector)

  if (trailingPseudo) {
    return `:where(${selectorPrefix}${rebuiltSelector}):not(:where([class~="${prefixedNot}"],[class~="${prefixedNot}"] *))${trailingPseudo}`
  }

  return `:where(${selectorPrefix}${selector}):not(:where([class~="${prefixedNot}"],[class~="${prefixedNot}"] *))`
}

const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')

// const rem = (px: number) => `${round(px / 16)}rem`

const em = (px: number, base: number) => `${round(px / base)}em`

// const hexToRgb = (hex: string) => {
//   hex = hex.replace('#', '')
//   hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
//   const r = parseInt(hex.substring(0, 2), 16)
//   const g = parseInt(hex.substring(2, 4), 16)
//   const b = parseInt(hex.substring(4, 6), 16)
//   return `${r} ${g} ${b}`
// }

const styles = (theme: PluginAPI['theme']) => ({
  DEFAULT: {
    '[class~="lead"]': {
      fontStyle: 'italic'
    },
    section: {
      paddingTop: em(16, 16),
      paddingBottom: em(16, 16)
    },
    a: {
      textUnderlineOffset: em(8, 16),
      '&:hover': {
        textDecorationColor: 'var(--tw-prose-links-hover-bg)',
        backgroundColor: 'var(--tw-prose-links-hover-bg)',
        color: 'var(--tw-prose-links-hover-text)',
        textShadow: 'none'
      },
      '&::selection': {
        backgroundColor: theme('colors.gray.500'),
        color: 'var(--tw-prose-pre-bg)',
        textShadow: 'none'
      }
    },
    'a.anchor': {
      textDecoration: 'none'
    },
    h1: {
      fontWeight: 'normal',
      marginTop: em(20, 18),
      marginBottom: em(14, 16)
    },
    h2: {
      fontWeight: 'normal',
      fontStyle: 'italic',
      marginTop: em(24, 18),
      marginBottom: em(16, 16)
    },
    h3: {
      fontWeight: 'normal',
      fontStyle: 'italic',
      marginTop: em(24, 18),
      marginBottom: em(16, 16)
    },
    // Auto-linked headings
    'h2 > a, h3 > a': {
      fontWeight: 'normal'
    },
    pre: {
      borderColor: 'var(--tw-prose-borders)',
      borderWidth: '1px',
      borderStyle: 'dashed',
      overflow: 'auto',
      backgroundColor: 'var(--tw-prose-pre-bg)'
      // padding: em(16, 16),
      // marginTop: em(16, 16),
      // marginBottom: em(16, 16),
      // color: 'var(--tw-prose-pre-code)',
      // '.highlight': {
      //   background: 'hsla(0, 0%, 70%, .5)'
      // },
      // '> code.highlight': {
      //   outline: '.4em solid var(--tw-prose-pre-code-highlight)',
      //   outlineOffset: '.4em'
      // }
    },
    blockquote: {
      position: 'relative',
      fontStyle: 'regular',
      border: '0',
      marginTop: '0',
      marginLeft: em(8, 16),
      marginBottom: em(12, 16),
      marginRight: '0',
      paddingLeft: em(12, 16),
      p: {
        width: '100%'
      },
      'p:first-of-type::before': {
        content: '">"',
        display: 'block',
        position: 'absolute',
        left: em(-8, 16),
        color: 'inherit'
      }
    },
    'blockquote footer': {
      fontSize: '0.75rem',
      textAlign: 'right'
    },
    '.newthought': {
      fontVariant: 'small-caps'
    },
    ol: {
      position: 'relative',
      listStyle: 'none',
      marginTop: '0',
      marginBottom: em(12, 16),
      padding: '0',
      marginLeft: theme('spacing.7')
    },
    'ol > li': {
      counterIncrement: 'li'
    },
    'ol > li::before': {
      content: 'counter(li)',
      color: 'inherit',
      position: 'absolute',
      left: '-20px'
    },
    ul: {
      position: 'relative',
      listStyle: 'none',
      marginTop: '0',
      marginBottom: em(12, 16),
      padding: '0',
      marginLeft: theme('spacing.7')
    },
    'ul > li': {
      counterIncrement: 'li'
    },
    'ul > li::before': {
      content: '"*"',
      color: 'inherit',
      position: 'absolute',
      left: '-20px'
    },
    li: {
      marginBottom: theme('spacing.1')
    },
    thead: {
      borderBottomStyle: 'dashed'
    },
    tr: {
      borderBottomStyle: 'dashed'
    },
    'tr:nth-of-type(even)': {
      backgroundColor: 'var(--tw-prose-tr-even)'
    },
    figure: {
      maxWidth: '100%',
      marginTop: theme('spacing.5'),
      marginBottom: theme('spacing.5')
    },
    'figure > figcaption': {
      marginTop: em(8, 16),
      color: 'var(--tw-prose-body)'
    },
    'figure.fullwidth': {
      display: 'block',
      gridTemplateColumns: 'initial',
      marginTop: em(20, 16),
      marginBottom: em(20, 16)
    },
    '.video-wrapper': {
      aspectRatio: '16 / 9'
    },
    '.video-wrapper > iframe': {
      height: '100%',
      width: '100%'
    }
  }
})

export default {
  content: ['./src/**/*.{ts,tsx}'],
  safelist: ['aspect-video', 'inline-block', 'group-hover:inline-block'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px'
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      animation: {
        marquee: 'marquee 30s linear infinite',
        marquee2: 'marquee2 30s linear infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '5%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '5%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      },
      fontFamily: {
        primary: ['var(--font-plex-mono)', 'sans-serif'],
        sans: ['var(--font-plex-mono)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace']
      }
    }
  },
  // variants: {
  //   typography: ['dark']
  // },
  plugins: [
    forms,
    typography,
    aspectRatio,
    plugin.withOptions<{ className?: string; target?: 'modern' }>(function ({
      className = 'prose'
      // target = 'modern'
    } = {}) {
      return function (api) {
        const { e, config, theme, ...rest } = api
        const { prefix } = rest as any
        const styleProfile = styles(theme)

        const prefixed = Object.keys(styleProfile).map((modifier) => ({
          [modifier === 'DEFAULT'
            ? `.${className}`
            : `.${className}-${modifier}`]: Object.fromEntries(
            // @ts-expect-error
            Object.keys(styleProfile[modifier]).map((prop) => [
              `${inWhere(prop, { className, modifier, prefix })}`,
              // @ts-expect-error
              styleProfile[modifier][prop]
            ])
          )
        }))

        api.addComponents([
          ...prefixed,
          {
            [`.${className}-tufted`]: {
              '--tw-prose-body': theme('colors.black'),
              '--tw-prose-headings': theme('colors.black'),
              '--tw-prose-lead': theme('colors.black'),
              '--tw-prose-links': theme('colors.black'),
              '--tw-prose-links-hover-bg': theme('colors.blue.700'),
              '--tw-prose-links-hover-text': theme('colors.white'),
              '--tw-prose-bold': theme('colors.black'),
              '--tw-prose-counters': theme('colors.black'),
              '--tw-prose-bullets': theme('colors.black'),
              '--tw-prose-hr': theme('colors.black'),
              '--tw-prose-quotes': theme('colors.black'),
              '--tw-prose-quote-borders': theme('colors.black'),
              '--tw-prose-captions': theme('colors.black'),
              '--tw-prose-borders': theme('colors.gray.300'),
              '--tw-prose-code': theme('colors.black'),
              '--tw-prose-pre-code': '#977d49',
              '--tw-prose-pre-code-keyword': '#728fcb',
              '--tw-prose-pre-code-comment': '#9a949e',
              '--tw-prose-pre-code-tag': '#a42375',
              '--tw-prose-pre-code-function': '#a42375',
              '--tw-prose-pre-code-selector': '#4b38dc',
              '--tw-prose-pre-code-attr-name': '#4b38dc',
              '--tw-prose-pre-code-variable': '#bd3a28',
              '--tw-prose-pre-code-inserted': '#4b38dc',
              '--tw-prose-pre-code-important': '#bd3a28',
              '--tw-prose-pre-code-highlight': '#bd3a28',
              '--tw-prose-pre-code-selection': '#f2ece4',
              '--tw-prose-pre-bg': '#fafafa',
              '--tw-prose-th-borders': theme('colors.gray.300'),
              '--tw-prose-td-borders': theme('colors.gray.300'),
              '--tw-prose-tr-even': theme('colors.gray.100'),
              '--tw-prose-invert-body': theme('colors.white'),
              '--tw-prose-invert-headings': theme('colors.white'),
              '--tw-prose-invert-lead': theme('colors.white'),
              '--tw-prose-invert-links': theme('colors.white'),
              '--tw-prose-invert-bold': theme('colors.white'),
              '--tw-prose-invert-counters': theme('colors.white'),
              '--tw-prose-invert-bullets': theme('colors.white'),
              '--tw-prose-invert-hr': theme('colors.white'),
              '--tw-prose-invert-quotes': theme('colors.white'),
              '--tw-prose-invert-quote-borders': theme('colors.white'),
              '--tw-prose-invert-captions': theme('colors.white'),
              '--tw-prose-invert-borders': theme('colors.gray.700'),
              '--tw-prose-invert-code': theme('colors.white'),
              '--tw-prose-invert-pre-code': '#b3ace8',
              '--tw-prose-invert-pre-code-keyword': '#ffcc99',
              '--tw-prose-invert-pre-code-comment': '#6c6783',
              '--tw-prose-invert-pre-code-tag': '#e09142',
              '--tw-prose-invert-pre-code-function': '#9a86fd',
              '--tw-prose-invert-pre-code-selector': '#eeebff',
              '--tw-prose-invert-pre-code-attr-name': '#c4b9fe',
              '--tw-prose-invert-pre-code-variable': '#ffcc99',
              '--tw-prose-invert-pre-code-inserted': '#eeebff',
              '--tw-prose-invert-pre-code-important': '#c4b9fe',
              '--tw-prose-invert-pre-code-highlight': '#8a75f5',
              '--tw-prose-invert-pre-code-selection': '#6a51e6',
              '--tw-prose-invert-pre-bg': theme('colors.black'),
              '--tw-prose-invert-th-borders': theme('colors.gray.700'),
              '--tw-prose-invert-td-borders': theme('colors.gray.700'),
              '--tw-prose-invert-tr-even': theme('colors.gray.900')
            }
          }
        ])
      }
    })
  ]
} satisfies Config
