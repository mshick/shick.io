import type { ImageProps as NextImageProps } from 'next/image'
import NextImage from 'next/image'
import { Box, Image as ThemeUiImage } from 'theme-ui'

export interface ImageProps extends NextImageProps {
  variant?: string
}

export const Image = ({
  src,
  layout,
  variant,
  width,
  height,
  ...props
}: ImageProps) => {
  if (width && height) {
    return (
      <Box variant={`images.${variant ?? 'default'}`}>
        <NextImage
          src={src}
          width={width}
          height={height}
          layout={layout ?? 'responsive'}
          {...props}
        />
      </Box>
    )
  }

  return <ThemeUiImage src={src as string} variant={variant} {...props} />
}
