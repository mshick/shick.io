import type { HTMLAttributes, PropsWithChildren } from 'react';

export function Qrcode({
  children,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className="qrcode">{children}</div>;
}

export default Qrcode;
