import Link from 'components/Link'
import { PropsWithChildren } from 'react'
import { Article } from 'types'

type FooterLinkProps = {
  href: string
  label: string
}

function FooterLink({
  href,
  label,
  children
}: PropsWithChildren<FooterLinkProps>) {
  return (
    <Link
      href={href}
      className="flex flex-row gap-4 no-underline hover:bg-blue-700 hover:text-white whitespace-nowrap overflow-ellipsis overflow-hidden"
    >
      <div className="flex flex-row gap-4 whitespace-nowrap">
        <span className="w-14">({label})</span>
        <span>-&gt;</span>
      </div>
      <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
        {children}
      </div>
    </Link>
  )
}

export type ArticleFooterProps = Pick<
  Article,
  'editUrl' | 'shareUrl' | 'previous' | 'next'
>

export function ArticleFooter({
  editUrl,
  shareUrl,
  previous,
  next
}: ArticleFooterProps) {
  return (
    <>
      <hr className="my-8" />
      <footer className="flex flex-col gap-2">
        {next && (
          <FooterLink href={next.path} label="next">
            {next.title}
          </FooterLink>
        )}
        {previous && (
          <FooterLink href={previous.path} label="prev">
            {previous.title}
          </FooterLink>
        )}
        {editUrl && (
          <FooterLink href={editUrl} label="edit">
            github
          </FooterLink>
        )}
        {shareUrl && (
          <FooterLink
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}`}
            label="share"
          >
            twitter
          </FooterLink>
        )}
      </footer>
      <hr className="my-8" />
    </>
  )
}
