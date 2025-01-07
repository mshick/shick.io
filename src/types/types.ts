import type { ReactElement } from 'react';

type Renderable = number | string | ReactElement | Renderable[];

export type PropsWithCallableChildren<P, Q> = P & {
  children: (arg: Q) => Renderable | undefined;
};

export type ServerParams = Record<string, string | string[]>;

export type ServerProps<Params = ServerParams> = {
  params: Promise<Params>;
  searchParams: Promise<ServerParams>;
};

export type DocumentTypes = Record<string, string>;

export type SegmentData<Params = ServerParams> = {
  params: Promise<Params>;
};
