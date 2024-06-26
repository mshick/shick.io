import { Link } from '#/components/Link'
import { TagEntry, TagList } from '#/components/Tag/TagList'
import Layout from '#/layouts/Default'
import { DocumentTypes } from '#/types/types'
import { pick } from '@contentlayer2/utils'
import { allArticles, allPages } from 'contentlayer/generated'
import { InferGetStaticPropsType } from 'next'

export default function TagsPage({
  tags
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout seo={{ title: 'Tags' }}>
      <div className="w-full mt-8 max-w-none">
        <h1>Tags ({tags.length})</h1>
        <TagList tags={tags}>
          {({ tag, docs }) => (
            <>
              <Link href={tag.path}>#{tag.slug}</Link> ({docs.length})
            </>
          )}
        </TagList>
      </div>
    </Layout>
  )
}

export function getStaticProps() {
  const tagsByTags = (
    [...allPages, ...allArticles] as unknown as DocumentTypes[]
  )
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'tags'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .reduce<Record<string, TagEntry>>((prev, doc) => {
      if (!doc.tags) {
        return prev
      }

      const tags = doc.tags.reduce((p, t) => {
        p[t.slug] = {
          tag: t,
          docs: [...(p[t.slug]?.docs ?? []), doc]
        }
        return p
      }, prev)

      return tags
    }, {})

  const tags = Object.values(tagsByTags).sort((a, b) =>
    a.tag.slug.localeCompare(b.tag.slug)
  )

  return {
    props: {
      tags
    }
  }
}
