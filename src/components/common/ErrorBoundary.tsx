import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '../../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Robust React Error Boundary Component
 * Catches JavaScript errors anywhere in their child component tree,
 * logs the errors safely, and displays a graceful fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[300px] flex items-center justify-center p-6 bg-red-50/50 dark:bg-red-950/20 rounded-3xl border border-red-200 dark:border-red-900/50 m-4"
        >
          <div className="max-w-md text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {this.props.fallbackMessage ||
                'An unexpected error occurred while rendering this section. Your air defense data remains intact.'}
            </p>
            {this.state.error && (
              <pre className="text-[11px] font-mono text-left bg-slate-100 dark:bg-slate-800 p-3 rounded-xl mb-4 text-red-700 dark:text-red-400 overflow-x-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
