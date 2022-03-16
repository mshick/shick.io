import type { Theme } from 'theme-ui'
import type { Property } from 'csstype'
import codeTheme from '@theme-ui/prism/presets/duotone-light.json'
import { lighten } from '@theme-ui/color'

const sidebarWidth = 260

export const theme: Theme = {
  breakpoints: ['320px', '480px', '768px', '1024px'],
  borderWidths: [0, 1, 4],
  colors: {
    text: '#000000',
    background: '#ffffff',
    muted: '#333333',
    highlight: '#5a6084',
    surface: lighten('primary', 0.75) as unknown as Property.Color,
    primary: '#333333',
    secondary: '#8be9fd',
    success: '#50fa7b',
    error: '#ff5555',
    black: '#000000',
    link: '#0000EE',
  },
  fonts: {
    body: 'Inconsolata, monospace',
    heading: 'Inconsolata, monospace',
    code: 'monospace',
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.75,
    heading: 2,
  },
  fontSizes: [16, 20, 24, 28],
  space: [0, 4, 8, 16, 24, 32, 40],
  shadows: [
    `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
    `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`,
    `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`,
    `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)`,
    `0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)`,
  ],

  layout: {
    container: {
      margin: '0 auto',
      maxWidth: 960,
      px: [4, 16, 48, 96, 128],
    },
    page: {
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
    },
    main: {
      display: 'block',
      // ml: [0, 0, 0, sidebarWidth],
      ml: [0],
      transition: '.3s ease-in-out margin-left',
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
      zIndex: 997,
    },
    sidebar: {
      backgroundColor: 'background',
      height: '100%',
      position: 'fixed',
      transition: '.3s ease-in-out left',
      width: sidebarWidth,
      zIndex: 999,
    },
  },

  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      fontSize: 1,
      lineHeight: 'body',
      'input:-webkit-autofill:first-line': {
        color: (theme) => `${theme.colors.primary}!important`,
      },
      a: {
        variant: 'styles.focus',
      },
      pre: {
        ...codeTheme,
        fontFamily: 'code',
        backgroundColor: '#faf8f575',
        borderRadius: 10,
        borderColor: 'surface',
        borderWidth: 1,
        borderStyle: 'dashed',
        overflow: 'auto',
        p: 3,
        my: '48px!important',
      },
    },
    focus: {
      transition: '.2s linear box-shadow',
      ':focus': {
        outline: 'none',
        boxShadow: (theme) => `0 2px 0 0 ${theme.colors.primary}`,
      },
    },
    h1: {
      variant: 'text.heading',
      color: 'primary',
    },
    h2: {
      variant: 'text.heading',
      color: 'primary',
    },
    h3: {
      variant: 'text.heading',
      color: 'secondary',
    },
    h4: {
      variant: 'text.heading',
      color: 'text',
    },
    h5: {
      variant: 'text.heading',
      color: 'success',
    },
    h6: {
      variant: 'text.heading',
      color: 'error',
    },
    p: {
      mt: 0,
      mb: 3,
      code: {
        variant: 'styles.code',
      },
    },
    small: {
      color: 'muted',
      fontSize: 0,
    },
    a: {
      color: 'muted',
      variant: 'styles.focus',
    },
    code: {
      fontFamily: 'code',
      color: 'inherit',
      backgroundColor: 'surface',
      fontSize: '13px',
      p: 1,
    },

    hr: {
      border: 0,
      borderBottom: '1px solid',
      borderColor: 'muted',
    },
    ol: {
      mt: 0,
      mb: 3,
      pl: 4,
    },
    ul: {
      mt: 0,
      mb: 3,
      // special case so ul lines up with ol
      pl: '24px',
      listStyle: 'square',
    },
    li: {
      mb: 1,
      code: {
        variant: 'styles.code',
      },
      pre: {
        variant: 'styles.pre',
      },
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
            padding: (theme) => `${theme.space[2]}px ${theme.space[3]}px`,
          },
        },
        td: {
          color: '#666',
        },
      },
      tbody: {
        'tr:nth-of-type(even)': {
          backgroundColor: lighten('background', 0.01),
        },
        tr: {
          td: {
            padding: (theme) => `${theme.space[2]}px ${theme.space[3]}px`,
            border: (theme) =>
              `${theme.borderWidths[1]}px dashed ${theme.colors.surface}`,
          },
        },
      },
    },
    blockquote: {
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
      },
    },
    progress: {
      primary: {
        backgroundColor: 'surface',
        color: 'primary',
      },
      secondary: {
        backgroundColor: 'surface',
        color: 'secondary',
      },
      success: {
        backgroundColor: 'surface',
        color: 'success',
      },
      error: {
        backgroundColor: 'surface',
        color: 'error',
      },
    },
    donut: {
      primary: {
        color: 'primary',
      },
      secondary: {
        color: 'secondary',
      },
      success: {
        color: 'success',
      },
      error: {
        color: 'error',
      },
    },

    spinner: {
      primary: {
        color: 'primary',
      },
      secondary: {
        color: 'secondary',
      },
      success: {
        color: 'success',
      },
      error: {
        color: 'error',
      },
    },
  },

  // components
  alerts: {
    primary: {
      fontWeight: 'body',
      borderRadius: 0,
      px: 3,
      py: 2,
      color: 'text',
      backgroundColor: 'primary',
    },
    secondary: {
      variant: 'alerts.primary',
      color: 'background',
      backgroundColor: 'secondary',
    },
    success: {
      variant: 'alerts.primary',
      color: 'background',
      backgroundColor: 'success',
    },
    error: {
      variant: 'alerts.primary',
      backgroundColor: 'error',
    },
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
      py: 1,
    },
    secondary: {
      variant: 'badges.primary',
      color: 'secondary',
      borderColor: 'secondary',
    },
    success: {
      variant: 'badges.primary',
      color: 'success',
      borderColor: 'success',
    },
    error: {
      variant: 'badges.primary',
      color: 'error',
      borderColor: 'error',
    },
  },

  buttons: {
    focus: {
      ':focus': {
        outline: 'none',
        transition: '.2s linear box-shadow',
        boxShadow: (theme) => `0 0 0 2px ${theme.colors.muted}`,
      },
    },
    primary: {
      borderRadius: 0,
      cursor: 'pointer',
      minWidth: 120,
      px: 3,
      py: 2,
      variant: 'buttons.focus',
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'background',
      backgroundColor: 'secondary',
    },
    success: {
      variant: 'buttons.primary',
      color: 'background',
      backgroundColor: 'success',
    },
    error: {
      variant: 'buttons.primary',
      backgroundColor: 'error',
    },
    ghost: {
      variant: 'buttons.primary',
      backgroundColor: 'background',
    },
    icon: {
      cursor: 'pointer',
      borderRadius: 0,
      variant: 'buttons.focus',
    },
    close: {
      cursor: 'pointer',
      borderRadius: 0,
      variant: 'buttons.focus',
    },
    menu: {
      cursor: 'pointer',
      borderRadius: 0,
      variant: 'buttons.focus',
    },
  },

  cards: {
    primary: {
      boxShadow: 0,
      backgroundColor: 'surface',
    },
  },

  links: {
    nav: {
      variant: 'styles.a',
      fontWeight: 'body',
      ':before': {
        pr: [0],
        content: [`"["`],
      },
      ':after': {
        pl: [0],
        content: [`"]"`],
      },
      ':hover': {
        color: 'text',
        transition: '.2s linear color',
      },
      '&[aria-current="page"]': {
        color: 'text',
        pointerEvents: 'none',
      },
    },
    unstyled: {
      textDecoration: 'none',
      color: 'text',
      ':visited': {
        color: 'text',
      },
    },
    tag: {
      mr: 2,
      color: 'text',
      textDecoration: 'none',
      ':before': {
        pr: [0],
        content: [`"#"`],
      },
      ':hover': {
        backgroundColor: 'link',
        color: 'white',
        transition: 'all .2s linear',
      },
    },
  },

  text: {
    default: {
      fontFmaily: 'body',
      fontWeight: 'body',
      fontSize: 1,
      mt: 0,
      mb: 0,
    },
    tag: {
      color: 'green',
    },
    body: {
      fontFmaily: 'body',
      fontWeight: 'heading',
      fontSize: 2,
      p: 0,
      m: 0,
      lineHeight: 'body',
    },
    article: {
      title: {
        fontFmaily: 'body',
        fontWeight: 'heading',
        fontSize: 2,
        p: 0,
        m: 0,
        lineHeight: 'heading',
      },
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      fontSize: 2,
      mt: 0,
      pt: 4,
      mb: 4,
      a: {
        color: 'inherit',
      },
    },
  },

  images: {
    default: {},
    avatar: {},
  },

  forms: {
    label: {
      fontWeight: 'bold',
    },
    input: {
      borderRadius: 0,
      borderColor: 'muted',
      variant: 'styles.focus',
    },
    select: {
      borderRadius: 0,
      borderColor: 'muted',
      variant: 'styles.focus',
    },
    textarea: {
      borderRadius: 0,
      borderColor: 'muted',
      variant: 'styles.focus',
    },
    slider: {
      backgroundColor: 'muted',
    },
    radio: {
      color: 'muted',
      backgroundColor: 'background',
    },
    checkbox: {
      color: 'muted',
      backgroundColor: 'background',
    },
  },

  sizes: {
    container: {},
  },

  messages: {
    default: {
      borderRadius: 0,
      backgroundColor: 'surface',
    },
    primary: {
      variant: 'messages.default',
      borderLeftColor: 'primary',
    },
    secondary: {
      variant: 'messages.default',
      borderLeftColor: 'secondary',
    },
    success: {
      variant: 'messages.default',
      borderLeftColor: 'success',
    },
    error: {
      variant: 'messages.default',
      borderLeftColor: 'error',
    },
  },
}
