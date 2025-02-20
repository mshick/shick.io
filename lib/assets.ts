import { join } from 'node:path';
import type { Element, Root as Hast } from 'hast';
import { visit } from 'unist-util-visit';
import { type Image, type Output, isRelativePath, processAsset } from 'velite';
import type { VFile } from 'vfile';

const ABSOLUTE_ROOT = 'public';

export type CopyLinkedFilesOptions = Omit<Output, 'data' | 'clean'> & {
  uploads: { base: string; path: string };
};

const createIsUploadsPath = (uploadsBase: string) => (url: string) => {
  return url.startsWith(uploadsBase);
};

/**
 * rehype (markdown) plugin to copy linked files to public path and replace their urls with public urls
 *
 * Same as linked, but adds `height` and `width`
 *
 * @link https://github.com/zce/velite/blob/e56c5d477e6769f8cc696fe17352e76266a1c743/src/assets.ts#L138-L164
 */
export const rehypeCopyLinkedFiles =
  (options: CopyLinkedFilesOptions) => async (tree: Hast, file: VFile) => {
    if (
      !options.uploads.base.startsWith('/') ||
      !options.uploads.base.endsWith('/')
    ) {
      throw new Error('Uploads base must start and end with a /');
    }

    const isUploadsPath = createIsUploadsPath(options.uploads.base);
    const links = new Map<string, Element[]>();
    const linkedPropertyNames = ['href', 'src', 'poster'];
    visit(tree, 'element', (node) => {
      for (const name of linkedPropertyNames) {
        const value = node.properties[name];

        if (
          typeof value === 'string' &&
          (isRelativePath(value) || (isUploadsPath(value) && ABSOLUTE_ROOT))
        ) {
          const elements = links.get(value) ?? [];
          elements.push(node);
          links.set(value, elements);
        }
      }
    });
    await Promise.all(
      Array.from(links.entries()).map(async ([url, elements]) => {
        const isImage = elements.some((element) => element.tagName === 'img');
        const isUploads = isUploadsPath(url);

        const urlOrImage: string | Image = await processAsset(
          isUploads ? join(ABSOLUTE_ROOT, url) : url,
          isUploads ? join(process.cwd(), ABSOLUTE_ROOT) : file.path,
          options.name,
          options.base,
          isImage ? true : undefined,
        );

        if (!urlOrImage) {
          return;
        }

        let linkedUrl: string;
        let image: Image | undefined;

        if (typeof urlOrImage === 'string') {
          if (urlOrImage === url) {
            return;
          }

          linkedUrl = urlOrImage;
        } else {
          linkedUrl = urlOrImage.src;
          image = urlOrImage;
        }

        for (const node of elements) {
          for (const name of linkedPropertyNames) {
            if (name in node.properties) {
              node.properties[name] = linkedUrl;
            }
          }

          if (image && node.tagName === 'img') {
            node.properties.height = String(image.height);
            node.properties.width = String(image.width);
          }
        }
      }),
    );
  };
