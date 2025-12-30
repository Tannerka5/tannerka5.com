import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-gray-900 dark:bg-gray-900 dark:bg-dark-bg">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-earth dark:text-gray-100 dark:text-gray-100 dark:text-dark-text mb-4">
              Oops! Something went wrong
            </h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
