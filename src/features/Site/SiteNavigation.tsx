import { ThemeToggle } from '#/features/Site/components/ThemeToggle'
import { useFocus } from '#/hooks/useFocus'
import { useMiniSearch } from '#/hooks/useMiniSearch'
import { replaceState } from '#/utils/history'
import { useRouter } from 'next/router'
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { MobileMenu } from './components/MobileMenu'
import { NavigationMenu } from './components/NavigationMenu'
import { NavigationToggle } from './components/NavigationToggle'
import { SearchInput } from './components/SearchInput'
import { SearchResults } from './components/SearchResults'
import { NavigationItem } from './types'

export type SiteNavigationProps = {
  items: NavigationItem[]
}

export function SiteNavigation({ items }: SiteNavigationProps) {
  const { asPath } = useRouter()

  items = useMemo(
    () => items.map((item) => ({ ...item, current: asPath === item.path })),
    [asPath, items]
  )

  const [isOpen, setIsOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [inputRef, setInputFocus] = useFocus()

  const [setQuery, { isLoading, isReady, query, results }] = useMiniSearch()

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsSearchFocused(false)
    setQuery('')
    replaceState(window.location.pathname)
  }, [setQuery])

  const handleOpenSearch = useCallback(() => {
    setIsOpen(true)
    setInputFocus()
    setIsSearchFocused(true)
  }, [setInputFocus])

  const handleOpenMenu = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleQueryChange: ChangeEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      const searchQuery = e.target.value
      setQuery(searchQuery)
      replaceState(`?search=${encodeURIComponent(searchQuery)}`)
    },
    [setQuery]
  )

  const handleQueryFocus = useCallback(() => {
    setIsSearchFocused(true)
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const initialQuery = searchParams.get('search')

    if (initialQuery) {
      handleOpenSearch()
      setQuery(initialQuery)
    }
  }, [setQuery, handleOpenSearch])

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [handleClose])

  return (
    <nav className="flex flex-col">
      <div className="flex justify-between items-center h-16 w-full z-30">
        <a href="#content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <div className="flex flex-row w-full">
          {/* Top Menu */}
          {!isOpen && (
            <div className="hidden sm:flex">
              <NavigationMenu items={items} />
            </div>
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
      </div>

      <hr className="z-30" />

      {/* Mobile Menu */}
      {isOpen && !isSearchFocused && <MobileMenu items={items} />}

      {/* Search Results */}
      {isOpen && isSearchFocused && (
        <SearchResults
          isInitial={isReady && query.length < 2 && results.length === 0}
          isLoading={!isReady || isLoading}
          items={results}
          onClickLink={handleClose}
        />
      )}
    </nav>
  )
}
