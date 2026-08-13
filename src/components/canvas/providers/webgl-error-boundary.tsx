'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { FlatModeShell } from '@/components/hud/flat-mode-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorType: 'webgl_unsupported' | 'render_crash' | null;
  flatMode: boolean;
}

export class WebGLErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorType: null, flatMode: false };
  }

  static getDerivedStateFromError(_error: unknown): ErrorBoundaryState {
    return { hasError: true, errorType: 'render_crash', flatMode: false };
  }

  componentDidMount() {
    // Assert client context support for WebGL context creation
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        this.setState({ hasError: true, errorType: 'webgl_unsupported', flatMode: false });
      }
    } catch {
      this.setState({ hasError: true, errorType: 'webgl_unsupported', flatMode: false });
    }
  }

  render() {
    if (this.state.flatMode && this.state.errorType) {
      return <FlatModeShell reason={this.state.errorType} />;
    }

    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 bg-space-black min-h-screen font-sans">
          <Card className="max-w-md w-full p-6 text-center space-y-4 border-destructive/20">
            <div className="flex justify-center text-destructive">
              <AlertCircle className="size-12" />
            </div>
            <Typography variant="heading" className="text-white">
              {this.state.errorType === 'webgl_unsupported'
                ? 'WebGL Acceleration Unsupported'
                : '3D Graphics Render Crash'}
            </Typography>
            <Typography variant="body" className="text-slate-400">
              {this.state.errorType === 'webgl_unsupported'
                ? 'Your browser or GPU does not support WebGL. Use flat portfolio mode to browse content.'
                : 'An unexpected GPU error occurred. Try reloading or use flat portfolio mode.'}
            </Typography>
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => window.location.reload()} variant="primary">
                Reload
              </Button>
              <Button
                onClick={() => this.setState({ flatMode: true })}
                variant="outline"
              >
                Access flat 2D mode
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
export default WebGLErrorBoundary;

