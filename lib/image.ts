import { type Image, z } from 'velite';
import { linkToAsset } from './assets';
import { publicRootPath } from './env';

export interface ImageOptions {
  /**
   * root path for absolute path, if provided, the value will be processed as an absolute path
   * @default undefined
   */
  publicRootPath?: string;
  /**
   * allow remote url
   * @default false
   */
  allowRemoteUrl?: boolean;
}

/**
 * Image schema
 */
export const image = (options: ImageOptions = {}) =>
  z
    .string()
    .transform<Image | { src: string }>(async (value, { meta, addIssue }) => {
      try {
        const { allowRemoteUrl } = options;
        const { output } = meta.config;

        const asset = await linkToAsset({
          uri: value,
          path: meta.path,
          name: output.name,
          base: output.base,
          publicRootPath: options.publicRootPath ?? publicRootPath,
          allowRemoteUrl: allowRemoteUrl ?? false,
          isImage: true,
        });

        if (typeof asset === 'string') {
          return { src: asset };
        }

        return asset;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        addIssue({ fatal: true, code: 'custom', message });
        return null as never;
      }
    });
