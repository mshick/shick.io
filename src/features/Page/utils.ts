import { Page } from 'types'

export function getPagePageParams(pages: Page[]) {
  return pages.map((page) => ({
    params: {
      page: page.slug
    }
  }))
}
