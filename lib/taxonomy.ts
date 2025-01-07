import { getAvailable, getTaxonomy } from './fields';
import type { Category, Page, Post, Tag } from './schema';

type Collections = {
  category: Category[];
  tag: Tag[];
  post: Post[];
  page: Page[];
};

export async function prepareTaxonomy(collections: Collections) {
  const { category, tag, post, page } = collections;

  const docs = [...post.filter(getAvailable), ...page.filter(getAvailable)];

  const categoriesInDocs = new Set(
    docs.flatMap((item) => item.categories ?? []),
  );

  const categoriesFromDocs = await getTaxonomy(
    'content',
    'categories',
    Array.from(categoriesInDocs).filter(
      (i) => category.find((j) => j.name === i) == null,
    ),
  );

  if (categoriesFromDocs) {
    category.push(...categoriesFromDocs);
  }

  for (const i of category) {
    i.count.post = post.filter((j) => j.categories?.includes(i.name)).length;
    i.count.page = page.filter((j) => j.categories?.includes(i.name)).length;
    i.count.total = i.count.post + i.count.page;
  }

  const tagsInDocs = new Set(docs.flatMap((item) => item.tags ?? []));

  const tagsFromDocs = await getTaxonomy(
    'content',
    'tags',
    Array.from(tagsInDocs).filter((i) => tag.find((j) => j.name === i) == null),
  );

  if (tagsFromDocs) {
    tag.push(...tagsFromDocs);
  }

  for (const i of tag) {
    i.count.post = post.filter((j) => j.tags?.includes(i.name)).length;
    i.count.page = page.filter((j) => j.tags?.includes(i.name)).length;
    i.count.total = i.count.post + i.count.page;
  }

  return {
    tagCount: tag.length,
    categoryCount: category.length,
  };
}
