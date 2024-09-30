import NextImage, { type ImageProps } from 'next/image'
import { type DetailedHTMLProps, type ImgHTMLAttributes } from 'react'

export const Image = ({
  className,
  src,
  width,
  height,
  alt,
  ...props
}: DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  if (!src) {
    return null
  }

  if ((!width || !height) && typeof src === 'string') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={className} {...props}></img>
  }

  return (
    <NextImage
      {...(props as ImageProps)}
      src={src}
      alt={alt ?? ''}
      width={Number(width)}
      height={Number(height)}
    />
  )
}
