import { useTheme } from 'next-themes'

export type SiteFooterProps = {
  siteName: string
}

export function SiteFooter({ siteName }: SiteFooterProps) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <>
      {/* <hr /> */}
      <footer className="w-full pt-5 pb-10 text-center">
        {/* [[[[ {siteName} {format(new Date(), 'yyyy')} ]]]] */}
      </footer>
    </>
  )
}
