import type { PropsWithChildren } from 'react';
import { Link } from '#/components/Link';

export interface ErrorMessageProps {
  headline: string;
  subhead: string;
  body: string;
}

export const ErrorMessage = ({
  headline,
  subhead,
  body,
}: PropsWithChildren<ErrorMessageProps>) => {
  return (
    <>
      <div className="shrink-0 my-auto py-16 sm:py-32">
        <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
          {headline}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {subhead}
        </h1>
        <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
          {body}
        </p>
        <div className="mt-10 flex gap-3 sm:border-l sm:border-transparent">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-dashed text-sm font-medium hover:text-white hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back home
            <span aria-hidden="true" className="ml-2">
              {' '}
              -&gt;
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};
