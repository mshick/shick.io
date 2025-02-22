import { runSync } from '@mdx-js/mdx';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import * as runtime from 'react/jsx-runtime';

const sharedComponents = {
  Image,
};

const useMDXComponent = (code: string) => {
  return runSync(code, { ...runtime, baseUrl: import.meta.url }).default;
};

interface MDXProps {
  code: string;
  components?: MDXComponents;
  [key: string]: any;
}

export const MDXContent = ({ code, components, ...props }: MDXProps) => {
  const Component = useMDXComponent(code);
  return (
    <Component components={{ ...sharedComponents, ...components }} {...props} />
  );
};
