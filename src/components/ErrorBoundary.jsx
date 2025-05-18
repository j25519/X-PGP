import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg w-full max-w-2xl">
          <h3 className="text-lg font-semibold text-red-500">Something Went Wrong</h3>
          <p className="text-gray-300">
            We couldn’t display the key details. Try uploading a different key or resetting.
          </p>
          <button
            onClick={this.resetError}
            className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
          >
            Reset
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary