import type { Image, MDX } from '.contentlayer/generated'
import type { ReadTimeResults } from 'reading-time'
import type { Tag } from 'lib/types'
import React, { Fragment } from 'react'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Heading, Badge, Text, Box, Alert, Grid } from 'theme-ui'
import { mix } from '@theme-ui/color'
import { format } from 'date-fns'
import Main from './Main'
import Link from './Link'
import components from './MDXComponents'

const formatDate = (date) => format(new Date(date), 'd-MMM-u')

export type SourceArticleProps = {
  title: string
  tags: Tag[]
  publishedAt: string
  updatedAt: string
  author: string
  isPrivate: boolean
  image?: Image
  body: MDX
  readingTime?: ReadTimeResults
}

export default function SourceArticle({
  title,
  tags,
  publishedAt,
  updatedAt,
  author,
  isPrivate,
  image,
  body,
  readingTime,
}: SourceArticleProps) {
  const Component = useMDXComponent(body.code)
  return (
    <Fragment>
      {isPrivate && (
        <Fragment>
          <Alert variant="error" sx={{ mb: 4 }}>
            This is a private post
          </Alert>
        </Fragment>
      )}

      <Box sx={{ mb: 5 }}>
        <Grid columns={[2]} sx={{ my: 2 }}>
          <Box sx={{ textAlign: 'left' }}>
            {publishedAt && (
              <Text sx={{ color: 'muted', mt: '2px' }}>
                <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
              </Text>
            )}

            {tags ? (
              <Box
                as="ul"
                sx={{ p: 0, listStyle: 'none', display: 'inline', ml: 4 }}
              >
                {tags.map((tag) => {
                  return (
                    <Box as="li" key={tag.name} sx={{ display: 'inline' }}>
                      <Link href={tag.path} variant="tag">
                        {tag.name}
                      </Link>
                    </Box>
                  )
                })}
              </Box>
            ) : null}

            {readingTime ? (
              <Text as="div" sx={{ color: 'muted', mt: '2px' }}>
                {readingTime.text}
              </Text>
            ) : null}
          </Box>
        </Grid>

        <Box sx={{ textAlign: 'left', mt: 5 }}>
          <Heading as="h1" variant="text.article.title">
            {title}
          </Heading>
        </Box>
      </Box>

      <Component components={components} />

      {/* {tags ? (
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
      ) : null} */}

      {author ? (
        <Box>
          <Text>{author}</Text>
        </Box>
      ) : null}
    </Fragment>
  )
}
