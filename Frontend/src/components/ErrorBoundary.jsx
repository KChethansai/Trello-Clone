// ErrorBoundary component: catches unexpected render failures.
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // errors are intentionally contained so the app can render a fallback
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#1d2125] px-6 text-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-[#9fadbc] mb-5">
              Refresh the page or return to your workspace.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign('/main-page')}
              className="rounded bg-[#579dff] px-4 py-2 text-sm font-semibold text-[#1d2125]"
            >
              Go to workspace
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
