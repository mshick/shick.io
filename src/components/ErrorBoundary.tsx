import logger from 'lib/logger'
import type { PropsWithChildren } from 'react'
import { Component } from 'react'

type ErrorBoundaryProps = PropsWithChildren<{}>

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    logger.error(error.message, {
      stack: error.stack,
      name: error.name,
      ...errorInfo
    })
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
