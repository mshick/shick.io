import { Global, css } from '@emotion/react'

export default function GlobalStyles() {
  return (
    <Global
      styles={css`
        @font-face {
          font-family: 'Bitstream Vera Sans Mono';
          font-style: normal;
          font-weight: 400;
          font-display: optional;
          src: url(/fonts/bitstream-vera-sans-mono-regular.woff2)
            format('woff2');
        }

        @font-face {
          font-family: 'Bitstream Vera Sans Mono';
          font-style: italic;
          font-weight: 400;
          font-display: optional;
          src: url(/fonts/bitstream-vera-sans-mono-italic.woff2) format('woff2');
        }

        @font-face {
          font-family: 'Bitstream Vera Sans Mono';
          font-style: normal;
          font-weight: 700;
          font-display: optional;
          src: url(/fonts/bitstream-vera-sans-mono-bold.woff2) format('woff2');
        }

        @font-face {
          font-family: 'Bitstream Vera Sans Mono';
          font-style: italic;
          font-weight: 700;
          font-display: optional;
          src: url(/fonts/bitstream-vera-sans-mono-bold-italic.woff2)
            format('woff2');
        }
      `}
    />
  )
}
