import type { PropsWithChildren } from 'react'

export default function Blockquote({ children }: PropsWithChildren<{}>) {
  return <blockquote>{children}</blockquote>
}
