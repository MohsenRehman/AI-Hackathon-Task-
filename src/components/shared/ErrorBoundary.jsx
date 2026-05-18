import React from 'react';
import { ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 card max-w-lg mx-auto mt-12 text-center border-red-200 bg-red-50/10">
          <div className="p-4 bg-red-100 text-red-600 rounded-full mb-4">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mb-2">Something Went Wrong</h2>
          <p className="text-sm text-slate-600 mb-6">
            There was an unexpected error rendering this page. The system administrator has been notified.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
