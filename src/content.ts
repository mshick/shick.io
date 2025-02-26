import type { Category, Options, Page, Post, Tag } from '~/.velite';
import { category, options, page, post, tag } from '~/.velite';
import { devUrl, isProduction } from '~/lib/env';
import { intersection, keyBy, pick } from './lib/utils/nodash';

type Document = Page | Post;

const documents: Document[] = [...post, ...page];

const bySlug = {
  post: keyBy(post, 'slug'),
  page: keyBy(page, 'slug'),
  tag: keyBy(tag, 'slug'),
  category: keyBy(category, 'slug'),
};

const relatedFields = [
  'title',
  'publishedAt',
  'permalink',
  'excerpt',
  'excerptHtml',
] as const;

type Related = {
  related?: {
    [P in (typeof relatedFields)[number]]: Document[P];
  }[];
};

type Taxonomy = {
  categories?: { [P in 'name' | 'slug' | 'permalink']: Category[P] }[];
  tags?: { [P in 'name' | 'slug' | 'permalink']: Tag[P] }[];
};

type Filter<T> = (value: T, index: number, array: T[]) => boolean;
type Sorter<T> = (a: T, b: T) => number;

export type {
  Category,
  Document,
  Filter,
  Options,
  Page,
  Post,
  Related,
  Sorter,
  Tag,
  Taxonomy,
};

const available = (item: { draft: boolean }) => {
  return !isProduction || !item.draft;
};

export const filters = {
  none: (): boolean => true,
  featured: (item: { featured: boolean }) => item.featured,
};

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
    a.title > b.title ? -1 : 1,
};

function include<I extends keyof Taxonomy = never>(
  data: { [P in keyof Taxonomy]: string[] },
  includes?: I[],
): { [P in I]: Taxonomy[P] } {
  if (includes == null) {
    return {} as { [P in I]: Taxonomy[P] };
  }

  const entities = includes.map((include) => {
    if (include === 'categories') {
      return [
        include,
        getCategories(
          ['name', 'slug', 'permalink'],
          (i) => data.categories?.includes(i.name) ?? false,
        ) satisfies Taxonomy['categories'],
      ];
    }

    if (include === 'tags') {
      return [
        include,
        getTags(
          ['name', 'slug', 'permalink'],
          (i) => data.tags?.includes(i.name) ?? false,
        ) satisfies Taxonomy['tags'],
      ];
    }

    return [include, []];
  });

  return Object.fromEntries(entities);
}

export function getOptions<F extends keyof Options>(
  fields?: F[],
): { [P in F]: Options[P] } {
  return pick(options, fields);
}

export function getSiteUrl() {
  const { url } = getOptions(['url']);
  return isProduction && url ? url : devUrl;
}

export function getCategories<F extends keyof Category>(
  fields?: F[],
  filter: Filter<Category> = filters.none,
  limit = Number.POSITIVE_INFINITY,
  offset = 0,
): { [P in F]: Category[P] }[] {
  return category
    .filter(filter)
    .sort((a, b) => (a.count.total > b.count.total ? -1 : 1))
    .slice(offset, offset + limit)
    .map((author) => pick(author, fields));
}

export function getCategoriesCount(
  filter: Filter<Category> = filters.none,
): number {
  return category.filter(filter).length;
}

export function getCategory<F extends keyof Category>(
  filterOrSlug: Filter<Category> | string,
  fields?: F[],
): { [P in F]: Category[P] } | undefined {
  const c =
    typeof filterOrSlug === 'string'
      ? bySlug.category.get(filterOrSlug)
      : category.find(filterOrSlug);
  return c && pick(c, fields);
}

export function getCategoryByName<F extends keyof Category>(
  name: string,
  fields?: F[],
): { [P in F]: Category[P] } | undefined {
  return getCategory((i) => i.name === name, fields);
}

export function getTags<F extends keyof Tag>(
  fields?: F[],
  filter: Filter<Tag> = filters.none,
  limit = Number.POSITIVE_INFINITY,
  offset = 0,
): { [P in F]: Tag[P] }[] {
  return tag
    .filter(filter)
    .sort((a, b) => (a.count.total > b.count.total ? -1 : 1))
    .slice(offset, offset + limit)
    .map((tag) => pick(tag, fields));
}

export function getTagsCount(filter: Filter<Tag> = filters.none): number {
  return tag.filter(filter).length;
}

export function getTag<F extends keyof Tag>(
  filterOrSlug: Filter<Tag> | string,
  fields?: F[],
): { [P in F]: Tag[P] } | undefined {
  const t =
    typeof filterOrSlug === 'string'
      ? bySlug.tag.get(filterOrSlug)
      : tag.find(filterOrSlug);
  return t && pick(t, fields);
}

export function getTagByName<F extends keyof Tag>(
  name: string,
  fields?: F[],
): { [P in F]: Tag[P] } | undefined {
  return getTag((i) => i.name === name, fields);
}

export function getPages<F extends keyof Page>(
  fields?: F[],
  filter: Filter<Page> = filters.none,
  sorter: Sorter<Page> = sorters.titleAsc,
  limit = Number.POSITIVE_INFINITY,
  offset = 0,
): { [P in F]: Page[P] }[] {
  return page
    .filter(available)
    .filter(filter)
    .sort(sorter)
    .slice(offset, offset + limit)
    .map((p) => pick(p, fields));
}

export function getPagesCount(filter: Filter<Page> = filters.none): number {
  return page.filter(available).filter(filter).length;
}

export function getPage<F extends keyof Page>(
  filterOrSlug: Filter<Page> | string,
  fields?: F[],
): { [P in F]: Page[P] } | undefined {
  const p =
    typeof filterOrSlug === 'string'
      ? bySlug.page.get(filterOrSlug)
      : page.find(filterOrSlug);

  return p && pick(p, fields);
}

export function getPosts<
  F extends keyof Omit<Post, I>,
  I extends keyof Taxonomy = never,
>(
  fields?: F[],
  includes?: I[],
  filter: Filter<Post> = filters.none,
  sorter: Sorter<Post> = sorters.publishedAtDesc,
  limit = Number.POSITIVE_INFINITY,
  offset = 0,
): ({ [P in F]: Post[P] } & { [P in I]: Taxonomy[P] })[] {
  return post
    .filter(available)
    .filter(filter)
    .sort(sorter)
    .slice(offset, offset + limit)
    .map((p) => ({
      ...pick(p, fields),
      ...include(p, includes),
    }));
}

export function getPostsCount(filter: Filter<Post> = filters.none): number {
  return post.filter(available).filter(filter).length;
}

export function getPost<
  F extends keyof Omit<Post, I>,
  I extends keyof Taxonomy = never,
>(
  filterOrSlug: Filter<Post> | string,
  fields?: F[],
  includes?: I[],
): ({ [P in F]: Post[P] } & { [P in I]: Taxonomy[P] }) | undefined {
  const p =
    typeof filterOrSlug === 'string'
      ? bySlug.post.get(filterOrSlug)
      : post.find(filterOrSlug);

  return (
    p && {
      ...pick(p, fields),
      ...include(p, includes),
    }
  );
}

export function getPostWithPager<
  F extends keyof Omit<Post, I>,
  I extends keyof Taxonomy = never,
>(
  filter: Filter<Post>,
  fields?: F[],
  includes?: I[],
): ({ [P in F]: Post[P] } & { [P in I]: Taxonomy[P] }) | undefined {
  const pI = post.findIndex(filter);
  const p = post[pI];
  const previous = post[pI - 1];
  const next = post[pI + 1];

  return (
    p && {
      ...pick(p, fields),
      ...include(p, includes),
      pager: {
        previous:
          previous && pick(previous, ['title', 'permalink', 'excerptHtml']),
        next: next && pick(next, ['title', 'permalink', 'excerptHtml']),
      },
    }
  );
}

export function getDocuments<
  F extends keyof Omit<Document, I>,
  I extends keyof Taxonomy = never,
>(
  fields?: F[],
  includes?: I[],
  filter: Filter<Document> = filters.none,
  sorter: Sorter<Document> = sorters.publishedAtDesc,
  limit = Number.POSITIVE_INFINITY,
  offset = 0,
): ({ [P in F]: Document[P] } & { [P in I]: Taxonomy[P] })[] {
  return documents
    .filter(available)
    .filter(filter)
    .sort(sorter)
    .slice(offset, offset + limit)
    .map((doc) => ({
      ...pick(doc, fields),
      ...include(doc, includes),
    }));
}

export function getDocumentsCount(
  filter: Filter<Document> = filters.none,
): number {
  return documents.filter(available).filter(filter).length;
}

export function getRelatedCollection(
  doc: Pick<Document, 'permalink' | 'related' | '__type'> & Partial<Taxonomy>,
  collection: 'post' | 'page',
  limit = 3,
) {
  const categories = doc?.categories?.map((d) => d.name) ?? [];
  const tags = doc?.tags?.map((d) => d.name) ?? [];

  const related: Related['related'] = [];

  if (doc.related) {
    for (const permalink of doc.related) {
      const relatedDoc = bySlug[collection].get(permalink);
      if (relatedDoc) {
        related.push({
          ...pick(relatedDoc, [...relatedFields]),
        });
      }
    }
  }

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  related.push(
    ...getDocuments(
      [...relatedFields],
      undefined,
      (d) =>
        d.permalink !== doc?.permalink &&
        !related.some((r) => r.permalink === d.permalink) &&
        Boolean(
          intersection(d.categories ?? [], categories).length ||
            intersection(d.tags ?? [], tags).length,
        ),
    ),
  );

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  related.push(
    ...getDocuments(
      [...relatedFields],
      undefined,
      (d) =>
        d.__type === doc.__type &&
        d.permalink !== doc?.permalink &&
        !related.some((r) => r.permalink === d.permalink),
    ),
  );

  return related.slice(0, limit);
}

export function getRelated(
  doc: Pick<Document, 'permalink' | 'related' | '__type'> & Partial<Taxonomy>,
  limit = 3,
) {
  return getRelatedCollection(doc, doc.__type, limit);
}
