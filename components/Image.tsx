import NextImage from 'next/image'
import { Box } from 'theme-ui'

export const Image = ({ src, alt, height, width, variant }) => {
  return (
    <Box variant={`images.${variant ?? 'default'}`}>
      <NextImage
        src={src}
        alt={alt}
        height={height}
        width={width}
        layout="responsive"
      />
    </Box>
  )
}
