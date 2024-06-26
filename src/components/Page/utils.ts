import { Page } from '#/types/types'

export function getPagePageParams(pages: Page[]) {
  return pages.map((page) => ({
    params: {
      page: page.slug
    }
  }))
}
