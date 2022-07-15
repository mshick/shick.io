import { writeFileSync } from 'fs'
import RSS from 'rss'
import { allArticles } from '../.contentlayer/generated'

async function generate() {
  const feed = new RSS({
    title: 'Michael Shick',
    site_url: 'https://shick.io',
    feed_url: 'https://shick.io/feed.xml'
  })

  allArticles.map((post) => {
    feed.item({
      title: post.title,
      url: `https://shick.io/articles/${post.slug}`,
      date: post.publishedAt,
      description: post.summary
    })
  })

  writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
}

generate()
