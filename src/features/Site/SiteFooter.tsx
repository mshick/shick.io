export type SiteFooterProps = {
  showListeningTo?: boolean
  repoUrl?: string
}

export function SiteFooter({ repoUrl }: SiteFooterProps) {
  return (
    <>
      <footer className="w-full pt-0 h-10 pb-4 relative">
        {/* <div>{showListeningTo && <ListeningTo />}</div> */}
        {repoUrl ? (
          <div className="text-sm absolute right-0 top-0 bg-white dark:bg-black">
            <a
              href={repoUrl}
              className="hover:bg-blue-700 hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              &lt;src&gt;
            </a>
          </div>
        ) : null}
      </footer>
    </>
  )
}
