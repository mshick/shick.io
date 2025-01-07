import type { MDXComponents } from 'mdx/types';
import { Iframe } from '#/components/Iframe';
import { Image } from '#/components/Image';
import { Link } from '#/components/Link';

export const components: MDXComponents = {
  a: Link,
  img: Image,
  iframe: Iframe,
};
