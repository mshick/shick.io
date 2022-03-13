import { createContext, useContext, useReducer } from 'react'

const initialState = { isNavOpen: false }

const reducer = (state, actions) => {
  switch (actions.type) {
    case 'openNav':
      return { ...state, isNavOpen: true }

    case 'closeNav':
      return { ...state, isNavOpen: false }

    default:
      return
  }
}

export const AppDispatchContext = createContext(null)
export const AppStateContext = createContext(initialState)

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  )
}

export const useAppDispatchContext = () => {
  return useContext(AppDispatchContext)
}

export const useAppStateContext = () => {
  return useContext(AppStateContext)
}
