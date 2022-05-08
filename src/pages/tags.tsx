import { pick } from '@contentlayer/utils'
import { allDocuments } from 'contentlayer/generated'
import PageLayout from 'layouts/Page'
import map from 'lodash-es/map'
import sortBy from 'lodash-es/sortBy'
import type { InferGetStaticPropsType } from 'next'
import { Box, Heading } from 'theme-ui'
import type { DocumentTypes, Tag } from 'types'

type TagEntry = {
  tag: Tag
  docs: Pick<
    DocumentTypes,
    'slug' | 'path' | 'title' | 'excerpt' | 'publishedAt' | 'tags'
  >[]
}

export default function TagsPage({
  tags
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageLayout seo={{ title: 'tags' }}>
      <Heading as="h1">Tags ({tags.length})</Heading>
      <Box as="ul" sx={{ columnCount: 2, m: 0, p: 0, listStyle: 'none' }}>
        {map(tags, ({ tag, docs }) => (
          <Box as="li" key={tag.slug}>
            #{tag.slug} ({docs.length})
          </Box>
        ))}
      </Box>
    </PageLayout>
  )
}

export async function getStaticProps({ params }) {
  const tagsByTags = (allDocuments as unknown as DocumentTypes[]).reduce<{
    [k: string]: TagEntry
  }>((prev, doc) => {
    const d = pick(doc, [
      'slug',
      'path',
      'title',
      'excerpt',
      'publishedAt',
      'tags'
    ])

    if (!d.tags) {
      return prev
    }

    const tags = d.tags.reduce((p, t) => {
      p[t.slug] = {
        tag: t,
        docs: [...(p[t.slug]?.docs ?? []), d]
      }
      return p
    }, prev)

    return tags
  }, {})

  const tags = sortBy(Object.values(tagsByTags), (t) => t.tag.slug)

  return {
    props: { tags }
  }
}
