import mime from 'mime'
import { JsonPrimitive, JsonValue } from 'type-fest'
import { Repo, RepoBlob, RepoEntry, RepoTree, TextFile } from '../types'
import { isParentFile, isRepoTreeEntry } from '../utils'
import { TreeNode, TreeNodeParent } from './types'

export function deepClone<T extends JsonValue>(treeData: T): T {
  return JSON.parse(JSON.stringify(treeData))
}

export function findTargetNode(node: TreeNode, path: number[] | null) {
  path = path ?? []

  let targetNode = node

  for (const p of path) {
    if (isParentFile(targetNode)) {
      targetNode = targetNode.children[p]
    }
  }

  if (!targetNode) {
    throw new Error('invalid path')
  }

  return targetNode
}

export function findMaxId(node: TreeNode): number {
  const curId = node._id
  return isParentFile(node)
    ? Math.max(...[curId, ...node.children.map(findMaxId)])
    : curId
}

function getFileLanguage(name: string): TextFile['language'] {
  const ext = name.split('.').pop()
  switch (ext) {
    case 'md':
      return 'markdown'
    case 'mdx':
      return 'mdx'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'txt':
    default:
      return 'plaintext'
  }
}

export function initializeTree(
  inputRoot: RepoTree,
  repo: Repo,
  checkedStatus: number,
  openStatus: boolean
) {
  let curId = 1

  const addDefaults =
    (prevPath: string, depth: number) =>
    (entry: RepoEntry): TreeNode => {
      const basePath = prevPath === '' ? prevPath : `${prevPath}/`
      const nodePath = `${basePath}${entry.name}`
      const nodeDepth = depth + 1

      let node: TreeNode

      if (isRepoTreeEntry(entry)) {
        node = {
          _id: curId,
          isOpen: openStatus,
          checked: checkedStatus,
          type: 'parent' as const,
          path: nodePath,
          depth: nodeDepth,
          name: entry.name,
          children: entry.object.entries.map(addDefaults(nodePath, nodeDepth)),
          selected: false
        }
      } else if ((entry.object as RepoBlob).isBinary) {
        node = {
          _id: curId,
          checked: checkedStatus,
          type: 'binary' as const,
          path: nodePath,
          depth: nodeDepth,
          name: entry.name,
          mimeType: mime.getType(entry.name) ?? undefined,
          selected: false
        }
      } else {
        node = {
          _id: curId,
          checked: checkedStatus,
          type: 'text' as const,
          path: nodePath,
          depth: nodeDepth,
          name: entry.name,
          mimeType: mime.getType(entry.name) ?? undefined,
          text: (entry.object as RepoBlob).text,
          language: getFileLanguage(entry.name),
          selected: false
        }
      }

      curId += 1

      return node
    }

  return {
    _id: 0,
    isOpen: openStatus,
    checked: checkedStatus,
    type: 'parent' as const,
    name: 'root',
    depth: 0,
    path: repo.dataDir,
    children: inputRoot.entries.map(addDefaults(repo.dataDir, 0)),
    selected: false
  }
}

function setStatusDown(node: TreeNode, status: number) {
  const setChecked = (node: TreeNode) => {
    if (isParentFile(node)) {
      // return {
      //   ...node,
      //   checked: status,
      //   children: node.children.map(setChecked)
      // }
      node.checked = status
      node.children.map(setChecked)
      return
    }

    node.checked = status
    // return {
    //   ...node,
    //   checked: status
    // }
  }

  setChecked(node)
}

export const setAllCheckedStatus = setStatusDown

// calculate the check status of a node based on the check status of it's children
export function getNewCheckStatus(node: TreeNode) {
  if (!isParentFile(node) || !node.children.length) {
    return node.checked
  }

  const { children } = node

  let sum = 0
  for (const c of children) {
    sum += c.checked
  }

  let newCheckStatus = 0.5 // some checked
  if (sum === children.length) {
    newCheckStatus = 1 // all checked
  } else if (sum === 0) {
    newCheckStatus = 0 // all unchecked
  }

  return newCheckStatus
}

// recursively update check status up
export function updateStatusUp(nodes: TreeNode[]) {
  const currentNode = nodes.pop()

  if (currentNode === undefined) {
    return
  }

  currentNode.checked = getNewCheckStatus(currentNode)

  updateStatusUp(nodes)
}

// handle state change when user (un)check a TreeNode
export function checkNode(
  node: TreeNodeParent,
  path: number[] | null,
  status: number
) {
  let targetNode = findTargetNode(node, path)

  let curNode: TreeNodeParent = node
  const parentNodes: TreeNodeParent[] = [] // parent nodes for getNewCheckStatus() upwards

  if (path) {
    const p = path.slice(0, -1)
    for (const idx of p) {
      curNode = curNode.children[idx] as TreeNodeParent
      parentNodes.push(curNode)
    }
  }

  targetNode = setStatusDown(targetNode, status) // update check status of this node and all childrens, in place

  parentNodes.pop() // don't need to check this node's level
  updateStatusUp(parentNodes) // update check status up, from this nodes parent, in place

  return { ...node }
}

export function renameNode(
  node: TreeNodeParent,
  path: number[] | null,
  newName: string
) {
  const targetNode = findTargetNode(node, path ?? [])
  targetNode.name = newName

  return { ...node }
}

export function deleteNode(root: TreeNodeParent, path: number[] | null) {
  if (!path) {
    throw new Error('cannot delete the tree root')
  }

  let curNode: TreeNodeParent = root
  if (path?.length === 0) {
    // this is root node
    // just remove every children and reset check status to 0
    curNode.children = []
    curNode.checked = 0

    return curNode
  }

  const parentNodes = [curNode]
  const lastIdx = path[path.length - 1]

  for (const idx of path) {
    if (curNode.children) {
      const child = curNode.children[idx]
      if (isParentFile(child)) {
        parentNodes.push(curNode)
      }
    }
  }

  curNode.children.splice(lastIdx, 1) // remove target node
  updateStatusUp(parentNodes) // update check status up, from this nodes

  return { ...root }
}

export function addNode(
  root: TreeNodeParent,
  path: number[] | null,
  hasChildren = false
) {
  const id = findMaxId(root) + 1
  const targetNode = findTargetNode(root, path ?? [])

  if (isParentFile(targetNode)) {
    const { children } = targetNode
    if (!hasChildren) {
      // files goes to front
      children.unshift({
        _id: id,
        name: 'file',
        checked: Math.floor(targetNode.checked),
        type: 'text',
        depth: path?.length ?? 0,
        path: `${targetNode.path}/file`,
        selected: false,
        language: 'markdown',
        text: ''
      } as TextFile)
    } else {
      // folder goes to back
      children.push({
        _id: id,
        name: 'folder',
        checked: Math.floor(targetNode.checked),
        type: 'parent',
        depth: path?.length ?? 0,
        path: `${targetNode.path}/folder`,
        children: [],
        isOpen: false,
        selected: false
      })
    }
  } else {
    throw new Error('can only add to a TreeNodeParent')
  }

  return { ...root }
}

export function toggleOpen(
  root: TreeNodeParent,
  path: number[] | null,
  isOpen: boolean
) {
  const targetNode = findTargetNode(root, path ?? [])

  if (isParentFile(targetNode)) {
    targetNode.isOpen = isOpen
  } else {
    throw new Error('only parent node (folder) can be opened!!')
  }

  return { ...root }
}

export function setAllOpenStatus(node: TreeNode, isOpen: boolean) {
  const newNode = { ...node }

  if (isParentFile(newNode)) {
    newNode.isOpen = isOpen
    newNode.children = newNode.children.map((child) =>
      setAllOpenStatus(child, isOpen)
    )
  }

  return newNode
}

export function isValidOpenStatus(node: TreeNode) {
  if (isParentFile(node) && node.isOpen === undefined) {
    return false // parent node needs to have 'isOpen'
  }

  if (isParentFile(node)) {
    for (const child of node.children) {
      if (!isValidOpenStatus(child)) {
        return false
      }
    }
  }

  return true
}

export const getEvent = (
  eventName: string,
  path: number[] | null,
  ...params: unknown[]
) => ({
  type: eventName,
  path,
  params
})

export function initializeTreeState(
  data: RepoTree,
  repo: Repo,
  initCheckedStatus: 'checked' | 'unchecked' = 'unchecked',
  initOpenStatus: 'open' | 'closed' = 'open'
) {
  const checkedStatus = initCheckedStatus === 'unchecked' ? 0 : 1
  const openStatus = initOpenStatus === 'open' ? true : false

  return initializeTree(data, repo, checkedStatus, openStatus)
}

export function findAllTargetPathByProp(
  root: TreeNodeParent,
  key: keyof TreeNode,
  value: JsonPrimitive
) {
  const paths: number[][] = []

  const walk = (node: TreeNode, path: number[]) => {
    if (node[key] === value) {
      paths.push(deepClone(path))
    }

    if (isParentFile(node)) {
      node.children.forEach((n, i) => walk(n, [...path, i]))
    }
  }

  walk(root, [])

  return paths
}

export function findTargetPathByProp(
  root: TreeNodeParent,
  key: keyof TreeNode,
  value: JsonPrimitive
) {
  const allPaths = findAllTargetPathByProp(root, key, value)
  return allPaths.length > 0 ? allPaths[0] : null
}
