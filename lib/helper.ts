import type { Category, Option, Page, Post, Tag } from '#/.velite'
import { categories, options, pages, posts, tags } from '#/.velite'
import { getAvailable } from './velite'

type Taxonomy = {
  categories: { [P in 'name' | 'slug' | 'permalink']: Category[P] }[]
  tags: { [P in 'name' | 'slug' | 'permalink']: Tag[P] }[]
}

type Filter<T> = (value: T, index: number, array: T[]) => boolean
type Sorter<T> = (a: T, b: T) => number

const available = getAvailable

export const filters = {
  none: (): boolean => true,
  featured: (item: { featured: boolean }) => item.featured
}

export const sorters = {
  publishedAtAsc: <I extends { publishedAt: string }>(a: I, b: I): number =>
    a.publishedAt > b.publishedAt ? 1 : -1,
  publishedAtDesc: <I extends { publishedAt: string }>(a: I, b: I): number =>
    a.publishedAt > b.publishedAt ? -1 : 1,
  updatedAtAsc: <I extends { updatedAt: string }>(a: I, b: I): number =>
    a.updatedAt > b.updatedAt ? 1 : -1,
  updatedAtDesc: <I extends { updatedAt: string }>(a: I, b: I): number =>
    a.updatedAt > b.updatedAt ? -1 : 1,
  nameAsc: <I extends { name: string }>(a: I, b: I): number =>
    a.name > b.name ? 1 : -1,
  nameDesc: <I extends { name: string }>(a: I, b: I): number =>
    a.name > b.name ? -1 : 1,
  countAsc: <I extends { count: { total: number } }>(a: I, b: I): number =>
    a.count.total > b.count.total ? 1 : -1,
  countDesc: <I extends { count: { total: number } }>(a: I, b: I): number =>
    a.count.total > b.count.total ? -1 : 1,
  titleAsc: <I extends { title: string }>(a: I, b: I): number =>
    a.title > b.title ? 1 : -1,
  titleDesc: <I extends { title: string }>(a: I, b: I): number =>
    a.title > b.title ? -1 : 1
}

function pick<T extends object, K extends keyof T>(
  obj: T,
  keys?: K[]
): { [P in K]: T[P] } {
  if (keys == null) {
    return obj
  }

  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as { [P in K]: T[P] }
}

function include<I extends keyof Taxonomy = never>(
  data: { [P in keyof Taxonomy]: string[] },
  includes?: I[]
): { [P in I]: Taxonomy[P] } {
  if (includes == null) {
    return {} as { [P in I]: Taxonomy[P] }
  }

  const entities = includes.map((include) => {
    if (include === 'categories') {
      return [
        include,
        getCategories(['name', 'slug', 'permalink'], (i) =>
          data.categories.includes(i.name)
        ) satisfies Taxonomy['categories']
      ]
    } else if (include === 'tags') {
      return [
        include,
        getTags(['name', 'slug', 'permalink'], (i) =>
          data.tags.includes(i.name)
        ) satisfies Taxonomy['tags']
      ]
    }
    return [include, []]
  })

  return Object.fromEntries(entities)
}

export function getOptions<F extends keyof Option>(
  fields?: F[]
): { [P in F]: Option[P] } {
  return pick(options, fields)
}

export function getCategories<F extends keyof Category>(
  fields?: F[],
  filter: Filter<Category> = filters.none,
  limit = Infinity,
  offset = 0
): { [P in F]: Category[P] }[] {
  return categories
    .filter(filter)
    .sort((a, b) => (a.count.total > b.count.total ? -1 : 1))
    .slice(offset, offset + limit)
    .map((author) => pick(author, fields))
}

export function getCategoriesCount(
  filter: Filter<Category> = filters.none
): number {
  return categories.filter(filter).length
}

export function getCategory<F extends keyof Category>(
  filter: Filter<Category>,
  fields?: F[]
): { [P in F]: Category[P] } | undefined {
  const category = categories.find(filter)
  return category && pick(category, fields)
}

export function getCategoryByName<F extends keyof Category>(
  name: string,
  fields?: F[]
): { [P in F]: Category[P] } | undefined {
  return getCategory((i) => i.name === name, fields)
}

export function getCategoryBySlug<F extends keyof Category>(
  slug: string,
  fields?: F[]
): { [P in F]: Category[P] } | undefined {
  return getCategory((i) => i.slug === slug, fields)
}

export function getTags<F extends keyof Tag>(
  fields?: F[],
  filter: Filter<Tag> = filters.none,
  limit = Infinity,
  offset = 0
): { [P in F]: Tag[P] }[] {
  return tags
    .filter(filter)
    .sort((a, b) => (a.count.total > b.count.total ? -1 : 1))
    .slice(offset, offset + limit)
    .map((tag) => pick(tag, fields))
}

export function getTagsCount(filter: Filter<Tag> = filters.none): number {
  return tags.filter(filter).length
}

export function getTag<F extends keyof Tag>(
  filter: Filter<Tag>,
  fields?: F[]
): { [P in F]: Tag[P] } | undefined {
  const tag = tags.find(filter)
  return tag && pick(tag, fields)
}

export function getTagByName<F extends keyof Tag>(
  name: string,
  fields?: F[]
): { [P in F]: Tag[P] } | undefined {
  return getTag((i) => i.name === name, fields)
}

export function getTagBySlug<F extends keyof Tag>(
  slug: string,
  fields?: F[]
): { [P in F]: Tag[P] } | undefined {
  return getTag((i) => i.slug === slug, fields)
}

export const getPages = async <F extends keyof Page>(
  fields?: F[],
  filter: Filter<Page> = filters.none,
  sorter: Sorter<Page> = sorters.titleAsc,
  limit = Infinity,
  offset = 0
): Promise<{ [P in F]: Page[P] }[]> => {
  return pages
    .filter(available)
    .filter(filter)
    .sort(sorter)
    .slice(offset, offset + limit)
    .map((page) => pick(page, fields))
}

export const getPagesCount = async (
  filter: Filter<Page> = filters.none
): Promise<number> => {
  return pages.filter(available).filter(filter).length
}

export function getPage<F extends keyof Page>(
  filter: Filter<Page>,
  fields?: F[]
): { [P in F]: Page[P] } | undefined {
  const page = pages.find(filter)
  return page && pick(page, fields)
}

export const getPageBySlug = async <F extends keyof Page>(
  slug: string,
  fields?: F[]
): Promise<{ [P in F]: Page[P] } | undefined> => {
  return getPage((i) => i.slug === slug, fields)
}

export function getPosts<
  F extends keyof Omit<Post, I>,
  I extends keyof Taxonomy = never
>(
  fields?: F[],
  includes?: I[],
  filter: Filter<Post> = filters.none,
  sorter: Sorter<Post> = sorters.publishedAtDesc,
  limit = Infinity,
  offset = 0
): ({ [P in F]: Post[P] } & { [P in I]: Taxonomy[P] })[] {
  return posts
    .filter(available)
    .filter(filter)
    .sort(sorter)
    .slice(offset, offset + limit)
    .map((post) => ({
      ...pick(post, fields),
      ...include(post, includes)
    }))
}

export const getPostsCount = async (
  filter: Filter<Post> = filters.none
): Promise<number> => {
  return posts.filter(available).filter(filter).length
}

export const getPost = async <
  F extends keyof Omit<Post, I>,
  I extends keyof Taxonomy = never
>(
  filter: Filter<Post>,
  fields?: F[],
  includes?: I[]
): Promise<({ [P in F]: Post[P] } & { [P in I]: Taxonomy[P] }) | undefined> => {
  const post = posts.find(filter)
  return post && { ...pick(post, fields), ...include(post, includes) }
}

export const getPostBySlug = async <
  F extends keyof Omit<Post, I>,
  I extends keyof Taxonomy = never
>(
  slug: string,
  fields?: F[],
  includes?: I[]
): Promise<({ [P in F]: Post[P] } & { [P in I]: Taxonomy[P] }) | undefined> => {
  return getPost((i) => i.slug === slug, fields, includes)
}
