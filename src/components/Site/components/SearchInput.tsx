import {
  type ChangeEventHandler,
  type FocusEventHandler,
  type ForwardedRef,
  forwardRef,
} from 'react';

export type SearchInputProps = {
  value: string;
  onChange: ChangeEventHandler;
  onFocus: FocusEventHandler;
};

export const SearchInput = forwardRef(function _SearchInput(
  { value, onChange, onFocus }: SearchInputProps,
  ref: ForwardedRef<HTMLInputElement | null>,
) {
  return (
    <div className="max-w-[90%] w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div
          className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-bold"
          aria-hidden="true"
        >
          {'$>'}
        </div>
        <input
          ref={ref}
          value={value}
          id="search"
          name="search"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white dark:bg-black placeholder-gray-500 focus:outline-hidden focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="search"
          type="search"
          onChange={onChange}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
});
