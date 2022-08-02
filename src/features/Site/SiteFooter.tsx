import { ListeningTo } from 'features/Music/ListeningTo'

export type SiteFooterProps = {
  siteName: string
  showListeningTo: boolean
}

export function SiteFooter({ siteName, showListeningTo }: SiteFooterProps) {
  return (
    <>
      {/* <hr /> */}
      <footer className="w-full grid grid-cols-3 pt-0 pb-0 text-center divide-x">
        <div className="col-span-2">{showListeningTo && <ListeningTo />}</div>
        <div>{siteName}</div>
        {/* [[[[ {siteName} {format(new Date(), 'yyyy')} ]]]] */}
      </footer>
    </>
  )
}
