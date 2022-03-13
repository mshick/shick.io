import { allArticles } from '.contentlayer/generated'
import PageLayout from 'components/PageLayout'
import { InferGetStaticPropsType } from 'next'
import { Flex, Box } from 'theme-ui'
import ArticleListItem from 'components/ArticleListItem'
import { pick } from 'lib/utils/content'

export default function ArticlesPage({
  articles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageLayout title="Articles">
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
      pick(article, ['slug', 'title', 'excerpt', 'publishedAt'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
  return { props: { articles } }
}
