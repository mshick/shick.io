import type { HTMLAttributes, PropsWithChildren } from 'react';
import { isReactElement } from '#/lib/utils/types';

export function Pre(props: PropsWithChildren<HTMLAttributes<HTMLPreElement>>) {
  let className = props.className ?? '';

  if (isReactElement(props.children)) {
    const childClassName = props.children.props?.className ?? '';
    const [, languageName] = childClassName.match(/language-(\w+)/);
    if (languageName) {
      className = `${className} ${languageName}`.trim();
    }
  }

  return <pre className={className} {...props} />;
}

export default Pre;
