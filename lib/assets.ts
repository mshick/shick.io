import type { Element, Root as Hast } from 'hast'
import { visit } from 'unist-util-visit'
import { Image, isRelativePath, Output, processAsset } from 'velite'
import type { VFile } from 'vfile'

export type CopyLinkedFilesOptions = Omit<Output, 'data' | 'clean'>

/**
 * rehype (markdown) plugin to copy linked files to public path and replace their urls with public urls
 *
 * Same as linked, but adds `height` and `width`
 *
 * @link https://github.com/zce/velite/blob/e56c5d477e6769f8cc696fe17352e76266a1c743/src/assets.ts#L138-L164
 */
export const rehypeCopyLinkedFiles =
  (options: CopyLinkedFilesOptions) => async (tree: Hast, file: VFile) => {
    const links = new Map<string, Element[]>()
    const linkedPropertyNames = ['href', 'src', 'poster']
    visit(tree, 'element', (node) => {
      linkedPropertyNames.forEach((name) => {
        const value = node.properties[name]
        if (typeof value === 'string' && isRelativePath(value)) {
          const elements = links.get(value) ?? []
          elements.push(node)
          links.set(value, elements)
        }
      })
    })
    await Promise.all(
      Array.from(links.entries()).map(async ([url, elements]) => {
        const isImage = elements.some((element) => element.tagName === 'img')

        const urlOrImage: string | Image = await processAsset(
          url,
          file.path,
          options.name,
          options.base,
          isImage ? true : undefined
        )

        if (!urlOrImage) {
          return
        }

        let linkedUrl: string;
        let image: Image;

        if (typeof urlOrImage === 'string') {
          if (urlOrImage === url) {
            return
          }

          linkedUrl = urlOrImage
        } else {
          linkedUrl = urlOrImage.src
          image = urlOrImage;
        }

        elements.forEach((node) => {
          linkedPropertyNames.forEach((name) => {
            if (name in node.properties) {
              node.properties[name] = linkedUrl
            }
          })

          if (image && node.tagName === 'img') {
            node.properties['height'] = String(image.height)
            node.properties['width'] = String(image.width)
          }
        })
      })
    )
  }
