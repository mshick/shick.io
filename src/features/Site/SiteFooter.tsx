import { ListeningTo } from 'features/Music/ListeningTo'

export type SiteFooterProps = {
  siteName: string
  showListeningTo: boolean
}

export function SiteFooter({ siteName, showListeningTo }: SiteFooterProps) {
  return (
    <>
      <footer className="w-full pt-0 pb-4">
        <div>{showListeningTo && <ListeningTo />}</div>
      </footer>
    </>
  )
}
