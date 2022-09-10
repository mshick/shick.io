import { ListeningTo } from 'features/Music/ListeningTo'

export type SiteFooterProps = {
  siteName: string
  showListeningTo: boolean
}

export function SiteFooter({ siteName, showListeningTo }: SiteFooterProps) {
  return (
    <>
      <footer className="w-full pt-0 pb-4 relative">
        <div>{showListeningTo && <ListeningTo />}</div>
        <div className="text-sm absolute right-0 top-0 bg-white dark:bg-black">
          <a
            href="https://github.com/mshick/shick.io"
            className="hover:bg-blue-700 hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            [src]
          </a>
        </div>
      </footer>
    </>
  )
}
