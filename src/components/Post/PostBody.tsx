import type { Post } from '#/content'

export type PostBodyProps = Pick<Post, 'content'>

export function PostBody({ content }: PostBodyProps) {
  return (
    <div className="prose prose-tufted dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
