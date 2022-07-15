import { MutableRefObject, useCallback, useRef } from 'react'

export function useFocus(): [MutableRefObject<HTMLInputElement>, () => void] {
  const htmlElRef = useRef<HTMLInputElement>(null)

  const setFocus = useCallback(() => {
    setTimeout(() => htmlElRef.current?.focus())
  }, [])

  return [htmlElRef, setFocus]
}
