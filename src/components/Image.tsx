import NextImage from 'next/future/image'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

export type ImageProps = DetailedHTMLProps<
  Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'>,
  HTMLImageElement
>

export const Image = ({
  className,
  src,
  width,
  height,
  alt,
  ...props
}: ImageProps) => {
  if (!src || !width || !height) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={className} {...props}></img>
  }

  return (
    <NextImage
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      {...props}
    />
  )
}

export default Image
