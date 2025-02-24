'use client';

import { usePathname } from 'next/navigation';
import {
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThemeToggle } from '#/components/Site/components/ThemeToggle';
import type { Options } from '#/content';
import { useFocus } from '#/lib/hooks/useFocus';
import { useSearch } from '#/lib/hooks/useSearch';
import { replaceState } from '#/lib/utils/history';
import { Divider } from '../Divider';
import { MobileMenu } from './components/MobileMenu';
import { NavigationMenu } from './components/NavigationMenu';
import { NavigationToggle } from './components/NavigationToggle';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';

export type SiteHeaderProps = {
  siteName: string;
  navigationItems: Options['links'];
};

export function SiteHeader({ siteName, navigationItems }: SiteHeaderProps) {
  const pathname = usePathname();

  const items = useMemo(
    () =>
      navigationItems.map((item) => ({
        ...item,
        current: Boolean(new RegExp(item.match).exec(pathname)),
      })),
    [pathname, navigationItems],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [inputRef, setInputFocus] = useFocus();

  const [setQuery, { isLoading, query, results }] = useSearch();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsSearchFocused(false);
    setQuery('');
    replaceState(window.location.pathname);
  }, [setQuery]);

  const handleOpenSearch = useCallback(() => {
    setIsOpen(true);
    setInputFocus();
    setIsSearchFocused(true);
  }, [setInputFocus]);

  const handleOpenMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleQueryChange: ChangeEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      const searchQuery = e.target.value;
      setQuery(searchQuery);
      replaceState(`?search=${encodeURIComponent(searchQuery)}`);
    },
    [setQuery],
  );

  const handleQueryFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialQuery = searchParams.get('search');

    if (initialQuery) {
      handleOpenSearch();
      setQuery(initialQuery);
    }
  }, [setQuery, handleOpenSearch]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [handleClose]);

  return (
    <header className="flex flex-col py-4">
      {/* Branding - Desktop */}
      <div className="uppercase mt-4 mb-0 text-sm hidden sm:flex">
        # {siteName}
      </div>
      <nav className="flex justify-between items-center h-12 w-full z-30">
        <a href="#content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <div className="flex flex-row w-full">
          {/* Branding - Mobile */}
          {!isOpen && (
            <div className="uppercase py-2 sm:hidden"># {siteName}</div>
          )}

          {/* Top Menu */}
          {!isOpen && (
            <nav className="hidden sm:flex">
              <NavigationMenu items={items} />
            </nav>
          )}

          {/* Search Input */}
          {isOpen && (
            <div className="flex-1 flex items-center">
              <SearchInput
                ref={inputRef}
                value={query}
                onChange={handleQueryChange}
                onFocus={handleQueryFocus}
              />
            </div>
          )}

          {/* Search Toggle */}
          <div className="hidden sm:flex ml-auto">
            <NavigationToggle
              label="search"
              altText="Open search input"
              isOpen={isOpen}
              onOpen={handleOpenSearch}
              onClose={handleClose}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden ml-auto">
            <NavigationToggle
              label="menu"
              altText="Open mobile menu"
              isOpen={isOpen}
              onOpen={handleOpenMenu}
              onClose={handleClose}
            />
          </div>

          {/* Dark / Light Theme Toggle */}
          <div className="-mr-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <Divider className="z-30" />

      {/* Mobile Menu */}
      {isOpen && !isSearchFocused && <MobileMenu items={items} />}

      {/* Search Results */}
      {isOpen && isSearchFocused && (
        <SearchResults
          isInitial={query.length < 2 && results.length === 0}
          isLoading={isLoading}
          items={results}
          onClickLink={handleClose}
        />
      )}
    </header>
  );
}
