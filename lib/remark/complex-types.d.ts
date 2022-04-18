import { Literal, Parent, PhrasingContent } from 'mdast'
import { Properties } from 'hast'

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

declare module 'mdast' {
  interface StaticPhrasingContentMap {
    sidenote: Sidenote
    sidenoteReference: SidenoteReference
    sidenoteDefinition: SidenoteDefinition
  }

  // interface BlockContentMap {
  //   mdxFlowExpression: MdxFlowExpression
  // }
}

// declare module 'hast' {
//   interface RootContentMap {
//     mdxTextExpression: MdxTextExpression
//     mdxFlowExpression: MdxFlowExpression
//   }

//   interface ElementContentMap {
//     mdxFlowExpression: MdxFlowExpression
//     mdxFlowExpression: MdxFlowExpression
//   }
// }
