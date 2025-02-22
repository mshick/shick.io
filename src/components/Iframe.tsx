import type { IframeHTMLAttributes, PropsWithChildren } from 'react';

export function Iframe(
  props: PropsWithChildren<IframeHTMLAttributes<HTMLIFrameElement>>,
) {
  return <iframe className="w-full aspect-16/9" {...props} />;
}
