import type { Image, MDX } from '.contentlayer/generated'
import type { ReadTimeResults } from 'reading-time'
import React, { Fragment } from 'react'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Heading, Badge, Text, Flex, Box, Alert, Grid } from 'theme-ui'
import { mix } from '@theme-ui/color'
import { format } from 'date-fns'
import { Main } from '../Main'
import { Image as ImageComponent } from '../Image'
import { components } from '../mdx'

const formatDate = (date) => format(new Date(date), 'd-MMM-u')

export type SourceArticleProps = {
  title: string
  tags: string[]
  publishedAt: string
  updatedAt: string
  author: string
  isPrivate: boolean
  image?: Image
  body: MDX
  readingTime?: ReadTimeResults
}

export const SourceArticle = ({
  title,
  tags,
  publishedAt,
  updatedAt,
  author,
  isPrivate,
  image,
  body,
  readingTime,
  timeToRead,
  wordCount,
}: SourceArticleProps) => {
  const Component = useMDXComponent(body.code)

  return (
    <Main>
      {title ? (
        <Fragment>
          {isPrivate && (
            <Fragment>
              <Alert variant="error" sx={{ mb: 4 }}>
                This is a private post
              </Alert>
            </Fragment>
          )}

          <Grid columns={[3]} sx={{ my: 2 }}>
            <Box sx={{ textAlign: 'left' }}>
              {readingTime ? (
                <Text as="div" sx={{ color: 'muted', mt: '2px' }}>
                  {readingTime.text}
                </Text>
              ) : null}
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Heading as="h1" variant="text.body">
                {title}
              </Heading>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              {publishedAt && (
                <Text as="div" sx={{ color: 'muted', mt: '2px' }}>
                  {formatDate(publishedAt)}
                </Text>
              )}
            </Box>
          </Grid>

          <Flex sx={{ flexWrap: 'wrap', mb: 1 }}>
            <Box
              sx={{
                width: ['100%', '50%'],
              }}
            >
              {updatedAt && (
                <Text
                  as="div"
                  sx={{
                    color: 'muted',
                    textAlign: ['left', 'right'],
                  }}
                >
                  Date modified: {formatDate(updatedAt)}
                </Text>
              )}
            </Box>
          </Flex>

          <Flex sx={{ flexWrap: 'wrap', mb: 3 }}>
            <Box
              sx={{
                width: ['100%', '50%'],
              }}
            >
              {timeToRead ? (
                <Text
                  as="div"
                  sx={{ color: 'muted' }}
                >{`${timeToRead} min read / ${wordCount} words`}</Text>
              ) : null}
            </Box>
            {author && (
              <Box
                sx={{
                  width: ['100%', '50%'],
                }}
              >
                <Text
                  as="div"
                  sx={{ color: 'muted', textAlign: ['left', 'right'] }}
                >
                  Author: {author}
                </Text>
              </Box>
            )}
          </Flex>

          <Box sx={{ mb: 4 }}>
            {image && (
              <ImageComponent
                alt={image.alt ?? `${title}-image`}
                src={image.url}
                title={image.title ?? title}
                layout="fill"
              />
            )}
          </Box>
        </Fragment>
      ) : null}

      {tags ? (
        <Box sx={{ mb: 3 }}>
          {tags.map((tag, index: number) => (
            <Badge
              key={index}
              variant="primary"
              sx={{
                mb: 2,
                mr: 2,
                color: mix('muted', 'primary', index / tags.length),
                borderColor: mix('muted', 'primary', index / tags.length),
              }}
            >
              {tag}
            </Badge>
          ))}
        </Box>
      ) : null}

      <Component components={components} />
    </Main>
  )
}

export default SourceArticle
