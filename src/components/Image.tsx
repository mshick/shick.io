import NextImage, { ImageProps } from 'next/image'

export const Image = ({
  className,
  src,
  width,
  height,
  alt,
  ...props
}: ImageProps) => {
  if ((!width || !height) && typeof src === 'string') {
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
