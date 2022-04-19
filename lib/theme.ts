import type { Theme } from 'theme-ui'
import type { Property } from 'csstype'
import codeTheme from '@theme-ui/prism/presets/duotone-light.json'
import { lighten, darken } from '@theme-ui/color'

const sidebarWidth = 260

export const theme: Theme = {
  breakpoints: ['768px', '1024px'],
  borderWidths: [0, 1, 4],
  colors: {
    text: '#111111',
    background: '#fefefe',
    muted: lighten('text', 0.2) as unknown as Property.Color,
    extramuted: lighten('text', 0.5) as unknown as Property.Color,
    highlight: '#5a6084',
    surface: lighten('primary', 0.7) as unknown as Property.Color,
    primary: '#333333',
    secondary: '#8be9fd',
    success: '#50fa7b',
    error: '#ff5555',
    black: '#000000',
    link: '#0000EE'
  },
  fonts: {
    body: '"Bitstream Vera Sans Mono", monospace',
    heading: '"Bitstream Vera Sans Mono", monospace',
    code: '"Bitstream Vera Sans Mono", monospace'
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },
  lineHeights: {
    body: 1.8,
    heading: 1
  },
  fontSizes: [14, 16, 22, 32, 40],
  space: [0, 4, 8, 16, 24, 32, 60, 72],
  shadows: [
    `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
    `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`,
    `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`,
    `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)`,
    `0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)`
  ],

  layout: {
    container: {
      margin: '0 auto',
      maxWidth: 1024,
      // px: [4, 16, 48, 96, 128],
      pl: [6],
      pr: [6]
    },
    page: {
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    },
    main: {
      display: 'block',
      // ml: [0, 0, 0, sidebarWidth],
      ml: [0],
      transition: '.3s ease-in-out margin-left'
    },
    header: {
      alignItems: 'center',
      backgroundColor: 'background',
      borderBottom: (theme) =>
        `${theme.borderWidths[1]}px solid ${theme.colors.surface}`,
      display: 'flex',
      justifyContent: 'space-between',
      height: (theme) => `${theme.space[6]}px`,
      marginTop: 20,
      ml: [0],
      overflow: 'hidden',
      width: ['100%'],
      zIndex: 997
    },
    sidebar: {
      backgroundColor: 'background',
      height: '100%',
      position: 'fixed',
      transition: '.3s ease-in-out left',
      width: sidebarWidth,
      zIndex: 999
    },
    logo: {
      display: 'inline',
      background: 'link',
      color: 'white',
      userSelect: 'none',
      fontFmaily: 'body',
      fontWeight: 'body',
      fontSize: 1,
      mt: 0,
      mb: 0
    },
    excerpt: {
      p: {
        mt: 0,
        mb: 3
      }
    }
  },

  styles: {
    root: {
      minWidth: '320px',
      fontFamily: 'body',
      fontWeight: 'body',
      fontSize: 1,
      lineHeight: 'body',
      'input:-webkit-autofill:first-line': {
        color: (theme) => `${theme.colors.primary}!important`
      },
      counterReset: 'sidenote-counter',
      a: {
        variant: 'styles.focus'
      },
      pre: {
        ...codeTheme,
        fontSize: 0,
        fontFamily: 'code',
        backgroundColor: 'background',
        borderRadius: 10,
        borderColor: 'surface',
        borderWidth: 1,
        borderStyle: 'dashed',
        overflow: 'auto',
        p: 3,
        my: 3,
        width: ['100%', '70%']
      },
      '.rehype-code-title': {
        backgroundColor: darken('background', 0.05),
        p: 2,
        m: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        fontSize: 0,
        fontWeight: 'bold'
      },
      '.rehype-code-title+pre': {
        mt: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 0
      },
      '.hidden': {
        display: 'none'
      },
      'label.margin-toggle:not(.sidenote-number)': {
        display: ['inline', 'none']
      },
      'label.sidenote-number': {
        display: 'inline-block',
        maxHeight: '2rem'
      },
      '.sidenote-number::after': {
        content: 'counter(sidenote-counter)',
        fontSize: '0.7rem',
        top: '-0.5rem',
        left: '0.1rem',
        position: 'relative',
        verticalAlign: 'baseline'
      },
      '.sidenote-number': {
        counterIncrement: 'sidenote-counter'
      },
      '.sidenote-definition::before': {
        content: 'counter(sidenote-counter)',
        fontSize: '0.7rem',
        top: '-0.5rem',
        position: 'relative',
        verticalAlign: 'baseline'
      },
      '.marginnote-definition': {
        float: 'right',
        clear: 'right',
        marginRight: '-60%',
        width: '50%',
        marginTop: '0.3rem',
        marginBottom: 0,
        fontSize: 0,
        lineHeight: 1.3,
        verticalAlign: 'baseline',
        position: 'relative',
        display: ['none', 'none', 'none', 'block']
      },
      '.sidenote-definition': {
        float: 'right',
        clear: 'right',
        marginRight: '-60%',
        width: '50%',
        marginTop: '0.3rem',
        marginBottom: 0,
        fontSize: 0,
        lineHeight: 1.3,
        verticalAlign: 'baseline',
        position: 'relative',
        display: ['none', 'block']
      },
      'input.margin-toggle': {
        display: 'none'
      },
      '.margin-toggle:checked + .sidenote-definition': {
        display: 'block',
        float: 'left',
        left: '1rem',
        clear: 'both',
        width: '95%',
        margin: '1rem 2.5%',
        verticalAlign: 'baseline',
        position: 'relative'
      },
      '.margin-toggle:checked + .marginnote-definition': {
        display: 'block',
        float: 'left',
        left: '1rem',
        clear: 'both',
        width: '95%',
        margin: '1rem 2.5%',
        verticalAlign: 'baseline',
        position: 'relative'
      }
    },
    focus: {
      transition: '.2s linear box-shadow',
      ':focus': {
        outline: 'none',
        boxShadow: (theme) => `0 2px 0 0 ${theme.colors.primary}`
      }
    },
    section: {
      py: 3
    },
    h1: {
      variant: 'text.heading',
      color: 'primary',
      mt: 6,
      mb: 2,
      p: 0,
      fontSize: 4,
      lineHeight: 'body',
      width: ['100%', '70%']
    },
    h2: {
      variant: 'text.heading',
      color: 'primary',
      fontSize: 3,
      fontStyle: 'italic',
      width: ['100%', '70%']
    },
    h3: {
      variant: 'text.heading',
      color: 'primary',
      fontSize: 2,
      fontStyle: 'italic',
      width: ['100%', '70%']
    },
    h4: {
      variant: 'text.heading',
      color: 'primary',
      width: ['100%', '70%']
    },
    h5: {
      variant: 'text.heading',
      color: 'primary',
      width: ['100%', '70%']
    },
    h6: {
      variant: 'text.heading',
      color: 'primary',
      width: ['100%', '70%']
    },
    p: {
      mt: 0,
      mb: 3,
      code: {
        variant: 'styles.code'
      },
      width: ['100%', '70%']
    },
    small: {
      color: 'muted',
      fontSize: 0
    },
    a: {
      color: 'muted',
      variant: 'styles.focus'
    },
    code: {
      fontFamily: 'code',
      color: 'inherit',
      backgroundColor: 'surface',
      fontSize: '13px',
      p: 1
    },

    hr: {
      border: 0,
      borderBottom: '1px dashed',
      borderColor: 'muted'
    },
    ol: {
      mt: 0,
      mb: 3,
      pl: 4
    },
    ul: {
      mt: 0,
      mb: 3,
      // special case so ul lines up with ol
      pl: '24px',
      listStyle: 'square'
    },
    li: {
      mb: 1,
      code: {
        variant: 'styles.code'
      },
      pre: {
        variant: 'styles.pre'
      }
    },
    table: {
      borderCollapse: 'collapse',
      mb: 3,
      border: 'none',
      thead: {
        backgroundColor: lighten('background', 0.03),
        tr: {
          th: {
            border: (theme) =>
              `${theme.borderWidths[1]}px dashed ${theme.colors.surface}`,
            padding: (theme) => `${theme.space[2]}px ${theme.space[3]}px`
          }
        },
        td: {
          color: '#666'
        }
      },
      tbody: {
        'tr:nth-of-type(even)': {
          backgroundColor: lighten('background', 0.01)
        },
        tr: {
          td: {
            padding: (theme) => `${theme.space[2]}px ${theme.space[3]}px`,
            border: (theme) =>
              `${theme.borderWidths[1]}px dashed ${theme.colors.surface}`
          }
        }
      }
    },
    epigraph: {
      mb: 7,
      mt: 7,
      blockquote: {
        borderLeftWidth: 0,
        fontStyle: 'italic',
        fontSize: 0,
        footer: {
          fontStyle: 'normal'
        }
      }
    },
    blockquote: {
      width: ['100%', '70%'],
      borderRadius: 0,
      borderLeftColor: 'muted',
      borderLeftStyle: 'solid',
      borderLeftWidth: 2,
      mt: 0,
      ml: 2,
      mb: 3,
      mr: 0,
      p: {
        p: 3,
        mb: 0,
        width: '100%'
      },
      footer: {
        textAlign: 'right'
      }
    },
    figure: {
      width: ['100%', '70%'],
      '&.fullwidth': {
        width: '100%'
      },
      ':not(&.fullwidth) figcaption': {
        float: 'right',
        clear: 'right',
        marginRight: '-60%',
        width: '50%',
        marginTop: '0.3rem',
        marginBottom: 0,
        fontSize: 0,
        lineHeight: 1.3,
        verticalAlign: 'baseline',
        position: 'relative'
      }
    },
    progress: {
      primary: {
        backgroundColor: 'surface',
        color: 'primary'
      },
      secondary: {
        backgroundColor: 'surface',
        color: 'secondary'
      },
      success: {
        backgroundColor: 'surface',
        color: 'success'
      },
      error: {
        backgroundColor: 'surface',
        color: 'error'
      }
    },
    donut: {
      primary: {
        color: 'primary'
      },
      secondary: {
        color: 'secondary'
      },
      success: {
        color: 'success'
      },
      error: {
        color: 'error'
      }
    },

    spinner: {
      primary: {
        color: 'primary'
      },
      secondary: {
        color: 'secondary'
      },
      success: {
        color: 'success'
      },
      error: {
        color: 'error'
      }
    }
  },

  // components
  alerts: {
    primary: {
      fontWeight: 'body',
      borderRadius: 0,
      px: 3,
      py: 2,
      color: 'text',
      backgroundColor: 'primary'
    },
    secondary: {
      variant: 'alerts.primary',
      color: 'background',
      backgroundColor: 'secondary'
    },
    success: {
      variant: 'alerts.primary',
      color: 'background',
      backgroundColor: 'success'
    },
    error: {
      variant: 'alerts.primary',
      backgroundColor: 'error'
    }
  },

  badges: {
    primary: {
      color: 'primary',
      borderColor: 'primary',
      fontSize: 0,
      borderRadius: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: 'transparent',
      px: 2,
      py: 1
    },
    secondary: {
      variant: 'badges.primary',
      color: 'secondary',
      borderColor: 'secondary'
    },
    success: {
      variant: 'badges.primary',
      color: 'success',
      borderColor: 'success'
    },
    error: {
      variant: 'badges.primary',
      color: 'error',
      borderColor: 'error'
    }
  },

  buttons: {
    focus: {
      ':focus': {
        outline: 'none',
        transition: '.2s linear box-shadow',
        boxShadow: (theme) => `0 0 0 2px ${theme.colors.muted}`
      }
    },
    primary: {
      borderRadius: 0,
      cursor: 'pointer',
      minWidth: 120,
      px: 3,
      py: 2,
      variant: 'buttons.focus'
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'background',
      backgroundColor: 'secondary'
    },
    success: {
      variant: 'buttons.primary',
      color: 'background',
      backgroundColor: 'success'
    },
    error: {
      variant: 'buttons.primary',
      backgroundColor: 'error'
    },
    ghost: {
      variant: 'buttons.primary',
      backgroundColor: 'background'
    },
    icon: {
      cursor: 'pointer',
      borderRadius: 0,
      variant: 'buttons.focus'
    },
    close: {
      cursor: 'pointer',
      borderRadius: 0,
      variant: 'buttons.focus'
    },
    menu: {
      cursor: 'pointer',
      borderRadius: 0,
      variant: 'buttons.focus'
    }
  },

  cards: {
    primary: {
      boxShadow: 0,
      backgroundColor: 'surface'
    }
  },

  links: {
    nav: {
      variant: 'styles.a',
      fontWeight: 'body',
      display: 'inline',
      ':before': {
        pr: [0],
        content: [`"["`]
      },
      ':after': {
        pl: [0],
        content: [`"]"`]
      },
      ':hover': {
        backgroundColor: 'link',
        color: 'white',
        transition: 'all .2s linear'
      },
      '&[aria-current="page"]': {
        color: 'text',
        pointerEvents: 'none'
      },
      ':active': {
        textDecoration: 'none'
      },
      ':focus': {
        textDecoration: 'none',
        boxShadow: 'none'
      }
    },
    unstyled: {
      textDecoration: 'none',
      color: 'text',
      ':visited': {
        color: 'text'
      }
    },
    tag: {
      ml: 0,
      mr: 2,
      color: 'extramuted',
      textDecoration: 'none',
      ':before': {
        pr: [0],
        content: [`"#"`]
      },
      ':hover': {
        backgroundColor: 'link',
        color: 'white',
        transition: 'all .2s linear'
      }
    }
  },

  text: {
    default: {
      fontFmaily: 'body',
      fontWeight: 'body',
      fontSize: 1,
      mt: 0,
      mb: 0
    },
    tag: {
      color: 'green'
    },
    body: {
      fontFmaily: 'body',
      fontWeight: 'heading',
      fontSize: 2,
      p: 0,
      m: 0,
      lineHeight: 'body'
    },
    article: {
      title: {
        fontFmaily: 'body',
        fontWeight: 'heading',
        fontSize: 3,
        p: 0,
        m: 0,
        lineHeight: 'body',
        maxWidth: ['100%', '80%']
        // textAlign: 'center',
        // mx: 'auto',
      }
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: 2,
      mt: 5,
      mb: 4,
      a: {
        color: 'inherit'
      }
    }
  },

  images: {
    default: {},
    avatar: {}
  },

  forms: {
    label: {
      fontWeight: 'bold'
    },
    input: {
      borderRadius: 0,
      borderColor: 'muted',
      variant: 'styles.focus'
    },
    select: {
      borderRadius: 0,
      borderColor: 'muted',
      variant: 'styles.focus'
    },
    textarea: {
      borderRadius: 0,
      borderColor: 'muted',
      variant: 'styles.focus'
    },
    slider: {
      backgroundColor: 'muted'
    },
    radio: {
      color: 'muted',
      backgroundColor: 'background'
    },
    checkbox: {
      color: 'muted',
      backgroundColor: 'background'
    }
  },

  sizes: {
    container: {}
  },

  messages: {
    default: {
      borderRadius: 0,
      backgroundColor: 'surface'
    },
    primary: {
      variant: 'messages.default',
      borderLeftColor: 'primary'
    },
    secondary: {
      variant: 'messages.default',
      borderLeftColor: 'secondary'
    },
    success: {
      variant: 'messages.default',
      borderLeftColor: 'success'
    },
    error: {
      variant: 'messages.default',
      borderLeftColor: 'error'
    }
  }
}
