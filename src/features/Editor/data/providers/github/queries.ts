export const repoFilesQuery = /* GraphQL */ `
  query ($name: String!, $owner: String!, $expression: String!) {
    repository(name: $name, owner: $owner) {
      object(expression: $expression) {
        ... on Tree {
          entries {
            name
            type
            mode
            object {
              ... on Blob {
                byteSize
                text
                isBinary
              }
              ... on Tree {
                entries {
                  name
                  type
                  mode
                  object {
                    ... on Blob {
                      byteSize
                      text
                      isBinary
                    }

                    ... on Tree {
                      entries {
                        name
                        type
                        mode
                        object {
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

export const repoFileBlobQuery = /* GraphQL */ `
  query ($name: String!, $owner: String!, $expression: String!) {
    repository(name: $name, owner: $owner) {
      object(expression: $expression) {
        ... on Tree {
          entries {
            name
            type
            mode
            object {
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
`

export const headOidQuery = /* GraphQL */ `
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

export const commitChangesQuery = /* GraphQL */ `
  mutation ($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      clientMutationId
    }
  }
`
