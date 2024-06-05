import * as Sentry from '@sentry/nextjs'
import { NextPage, NextPageContext } from 'next'
import NextErrorComponent, { ErrorProps } from 'next/error'

type CustomErrorComponentProps = NextPageContext & Record<string, unknown>

const CustomErrorComponent: NextPage<ErrorProps> = (props) => {
  void Sentry.captureUnderscoreErrorException(props)
  return <NextErrorComponent statusCode={props.statusCode} />
}

CustomErrorComponent.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(
    contextData as CustomErrorComponentProps
  )
  return NextErrorComponent.getInitialProps(contextData)
}

export default CustomErrorComponent
