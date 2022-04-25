import { allDocuments } from '.contentlayer/generated'
import { pick } from '@contentlayer/utils'
import PageLayout from 'components/layouts/page'
import { DocumentTypes } from 'lib/types'
import map from 'lodash-es/map'
import sortBy from 'lodash-es/sortBy'
import toPairs from 'lodash-es/toPairs'
import type { InferGetStaticPropsType } from 'next'
import { Box, Heading } from 'theme-ui'

export default function TagsPage({
  docsByTags
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageLayout seo={{ title: 'tags' }}>
      <Heading as="h1">Tags ({docsByTags.length})</Heading>
      <Box as="ul" sx={{ columnCount: 2, m: 0, p: 0, listStyle: 'none' }}>
        {map(docsByTags, ([slug, { tag, docs }]) => (
          <Box as="li" key={tag.slug}>
            #{tag.slug} ({docs.length})
          </Box>
        ))}
      </Box>
    </PageLayout>
  )
}

export async function getStaticProps({ params }) {
  const docsByTags = (allDocuments as unknown as DocumentTypes[]).reduce(
    (prev, doc) => {
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
    },
    {}
  )

  return {
    props: { docsByTags: sortBy(toPairs(docsByTags), ([slug]) => slug) }
  }
}
