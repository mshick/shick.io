import { gql } from 'graphql-request'

export const repoFilesQuery = gql`
  query ($name: String!, $owner: String!, $expression: String!) {
    repository(name: $name, owner: $owner) {
      object(expression: $expression) {
        oid
        ... on Tree {
          entries {
            name
            type
            object {
              oid
              ... on Blob {
                byteSize
                text
                isBinary
              }
              ... on Tree {
                entries {
                  name
                  type
                  object {
                    oid
                    ... on Blob {
                      byteSize
                      text
                      isBinary
                    }

                    ... on Tree {
                      entries {
                        name
                        type
                        object {
                          oid
                          ... on Blob {
                            byteSize
                            text
                            isBinary
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const repoFileQuery = gql`
  query ($name: String!, $owner: String!, $oid: GitObjectID!) {
    repository(name: $name, owner: $owner) {
      object(oid: $oid) {
        oid
        ... on Blob {
          byteSize
          text
          isBinary
        }
      }
    }
  }
`

export const headOidQuery = gql`
  query ($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1) {
              nodes {
                oid
              }
            }
          }
        }
      }
    }
  }
`

export const createCommitQuery = gql`
  mutation ($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      clientMutationId
    }
  }
`
