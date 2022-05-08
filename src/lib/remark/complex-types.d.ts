import { Properties } from 'hast'
import { Parent, PhrasingContent } from 'mdast'

export interface SidenoteReference extends Parent {
  type: 'sidenoteReference'
  children: PhrasingContent[]
  data?: {
    hName: string
    hProperties: Properties
  } & Parent['data']
}

export interface SidenoteDefinition extends Parent {
  type: 'sidenoteDefinition'
  children: PhrasingContent[]
  data?: {
    hName: string
    hProperties: Properties
  } & Parent['data']
}

export interface Sidenote extends Parent {
  type: 'sidenote'
  children: PhrasingContent[]
  data?: {
    hName: string
    hProperties: Properties
  } & Parent['data']
}

export interface IframeWrapper extends Parent {
  type: 'iframeWrapper'
  children: PhrasingContent[]
  data?: {
    hName: 'figure'
    hProperties: Properties
  } & Parent['data']
}

export interface Figure extends Parent {
  type: 'figure'
  children: PhrasingContent[]
  data?: {
    hName: 'figure'
    hProperties: Properties
  } & Parent['data']
}

declare module 'mdast' {
  interface StaticPhrasingContentMap {
    sidenote: Sidenote
    sidenoteReference: SidenoteReference
    sidenoteDefinition: SidenoteDefinition
    iframeWrapper: IframeWrapper
    figure: Figure
  }
}
