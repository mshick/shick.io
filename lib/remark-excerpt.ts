import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkParse from 'remark-parse'

export async function remarkExcerpt(excerpt: string) {
  return remark().use(remarkParse).use(remarkHtml).process(excerpt)
}
