import { createContext } from 'react'
import { TreeState } from './index'

const defaultContext = {
  treeState: null,
  methods: {}
}

export const TreeStateContext = createContext<TreeState>(defaultContext)
