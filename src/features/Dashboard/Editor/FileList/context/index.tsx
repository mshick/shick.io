import React, { createContext, useContext, useState } from 'react'

type ContextMenuValues = {
  position: {
    x: number
    y: number
  }
  show: boolean
  setShow: (s: boolean) => void
  setPosition: (p: { x: number; y: number }) => void
}

const ContextMenuContext = createContext<ContextMenuValues | null>(null)

export function ContextMenuProvider(props: React.PropsWithChildren<{}>) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <ContextMenuContext.Provider
      value={{
        position,
        show,
        setShow: (s: boolean): void => setShow(s),
        setPosition: ({ x, y }) => setPosition({ x: x, y: y })
      }}
    >
      {props.children}
    </ContextMenuContext.Provider>
  )
}

export const useContextMenu = () => {
  return useContext(ContextMenuContext)
}
