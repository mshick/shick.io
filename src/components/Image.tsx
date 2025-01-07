import NextImage, { type ImageProps } from 'next/image';
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

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
    return null;
  }

  if ((!width || !height) && typeof src === 'string') {
    return <img src={src} alt="" className={className} {...props} />;
  }

  return (
    <NextImage
      {...(props as ImageProps)}
      src={src}
      alt={alt ?? ''}
      width={Number(width)}
      height={Number(height)}
    />
  );
};
