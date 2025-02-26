import { join } from 'node:path';
import type { Element, Root as Hast } from 'hast';
import { visit } from 'unist-util-visit';
import {
  type Image,
  type Output,
  getImageMetadata,
  isRelativePath,
  processAsset,
} from 'velite';
import type { VFile } from 'vfile';
import { createIsUploadsPath } from './util';

type LinkToAssetParams = {
  uri: string;
  path: string;
  name: string;
  base: string;
  publicRootPath: string;
  allowRemoteUrl: boolean;
  isImage: boolean;
};

export async function linkToAsset({
  uri,
  path,
  name,
  base,
  publicRootPath,
  allowRemoteUrl,
  isImage,
}: LinkToAssetParams) {
  const decoded = decodeURI(uri);

  if (publicRootPath && decoded.startsWith('/')) {
    return await processAsset(
      join(publicRootPath, decoded),
      join(process.cwd(), publicRootPath),
      name,
      base,
      isImage ? true : undefined,
    );
  }

  if (/^https?:\/\//.test(uri)) {
    if (!allowRemoteUrl) {
      return uri;
    }

    const response = await fetch(uri);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const metadata = await getImageMetadata(Buffer.from(buffer));

    if (metadata == null) {
      throw new Error(`Failed to get image metadata: ${uri}`);
    }
    return { src: uri, ...metadata };
  }

  // process asset as relative path
  return await processAsset(
    decoded,
    path,
    name,
    base,
    isImage ? true : undefined,
  );
}

export type CopyLinkedFilesOptions = Omit<Output, 'data' | 'clean'> & {
  publicRootPath: string;
  uploads: { baseUrl: string; folderPath: string };
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
      !options.uploads.baseUrl.startsWith('/') ||
      !options.uploads.baseUrl.endsWith('/')
    ) {
      throw new Error('Uploads base must start and end with a /');
    }
    const { publicRootPath } = options;

    const isUploadsPath = createIsUploadsPath(options.uploads.baseUrl);
    const links = new Map<string, Element[]>();
    const linkedPropertyNames = ['href', 'src', 'poster'];
    visit(tree, 'element', (node) => {
      for (const name of linkedPropertyNames) {
        const value = node.properties[name];

        if (
          typeof value === 'string' &&
          (isRelativePath(value) || (isUploadsPath(value) && publicRootPath))
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
        const urlOrImage: string | Image = await linkToAsset({
          uri: url,
          path: file.path,
          name: options.name,
          base: options.base,
          publicRootPath,
          allowRemoteUrl: true,
          isImage,
        });

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
