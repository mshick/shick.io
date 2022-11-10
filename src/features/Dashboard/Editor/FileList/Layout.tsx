import { PropsWithChildren } from 'react'

export function Layout({ children }: PropsWithChildren<{}>) {
  return <div className="px-20 py-10">{children}</div>
}
