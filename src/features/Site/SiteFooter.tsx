export type SiteFooterProps = {
  showListeningTo?: boolean
  repoUrl?: string
}

export function SiteFooter({ repoUrl }: SiteFooterProps) {
  return (
    <>
      <footer className="w-full">
        <hr className="z-30" />
        {/* <div>{showListeningTo && <ListeningTo />}</div> */}
        {repoUrl ? (
          <div className="flex py-6">
            <div className="ml-auto bg-white dark:bg-black">
              <a
                href={repoUrl}
                className="hover:bg-blue-700 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                &lt;src&gt;
              </a>
            </div>
          </div>
        ) : null}
      </footer>
    </>
  )
}
