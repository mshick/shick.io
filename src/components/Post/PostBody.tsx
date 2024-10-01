import type { Post } from '#/content'

export type PostBodyProps = Pick<Post, 'content'>

export function PostBody({ content }: PostBodyProps) {
  return (
    <div
      className="prose prose-tufted xl:prose-sidenotes dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
