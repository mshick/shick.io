import { PropsWithChildren } from 'react'

export function Item({
  children,
  className,
  ...props
}: PropsWithChildren<any>) {
  return (
    <li className="cursor-pointer" {...props}>
      {children}
    </li>
  )
}
