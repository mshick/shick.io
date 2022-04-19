import type { InferGetStaticPropsType } from 'next'
import { Flex, Box } from 'theme-ui'
import { pick } from '@contentlayer/utils'
import { allArticles } from '.contentlayer/generated'
import PageLayout from 'layouts/page'
import ArticleListItem from 'components/ArticleListItem'

export default function ArticlesPage({
  articles
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageLayout seo={{ title: 'Articles' }}>
      <Flex
        as="ul"
        sx={{ flexDirection: 'column', m: 0, p: 0, listStyleType: 'none' }}
      >
        {articles.map((article) => (
          <Box as="li" key={article.slug}>
            <ArticleListItem {...article} />
          </Box>
        ))}
      </Flex>
    </PageLayout>
  )
}

export async function getStaticProps({ params }) {
  const articles = allArticles
    .map((article) =>
      pick(article, ['slug', 'path', 'title', 'excerpt', 'publishedAt'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
  return { props: { articles } }
}
