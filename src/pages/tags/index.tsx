import { pick } from '@contentlayer/utils'
import { Link } from 'components/Link'
import { allArticles, allPages } from 'contentlayer/generated'
import { TagEntry, TagList } from 'features/Tag/TagList'
import Layout from 'layouts/Default'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { DocumentTypes } from 'types'

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

export async function getStaticProps({}: GetStaticPropsContext) {
  const tagsByTags = (
    [...allPages, ...allArticles] as unknown as DocumentTypes[]
  )
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'tags'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b['publishedAt'])) - Number(new Date(a['publishedAt']))
    )
    .reduce<{
      [k: string]: TagEntry
    }>((prev, doc) => {
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
