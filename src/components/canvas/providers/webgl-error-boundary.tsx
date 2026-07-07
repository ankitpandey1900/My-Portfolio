'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorType: 'webgl_unsupported' | 'render_crash' | null;
}

export class WebGLErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorType: null };
  }

  static getDerivedStateFromError(_error: unknown): ErrorBoundaryState {
    return { hasError: true, errorType: 'render_crash' };
  }

  componentDidMount() {
    // Assert client context support for WebGL context creation
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        this.setState({ hasError: true, errorType: 'webgl_unsupported' });
      }
    } catch {
      this.setState({ hasError: true, errorType: 'webgl_unsupported' });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 bg-space-black min-h-screen font-sans">
          <Card
            variant="glass"
            className="max-w-md w-full p-6 text-center space-y-4 border-destructive/20"
          >
            <div className="flex justify-center text-destructive">
              <AlertCircle className="size-12 animate-pulse" />
            </div>
            <Typography variant="heading" className="text-white">
              {this.state.errorType === 'webgl_unsupported'
                ? 'WebGL Acceleration Unsupported'
                : '3D Graphics Render Crash'}
            </Typography>
            <Typography variant="body" className="text-slate-400">
              {this.state.errorType === 'webgl_unsupported'
                ? 'Your web browser or hardware GPU drivers do not support WebGL graphics acceleration. WebGL is required to navigate the interactive 3D solar system.'
                : 'An unexpected GPU error occurred while compiling or running the 3D space scene. Try reloading the interface.'}
            </Typography>
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => window.location.reload()} variant="primary">
                Reload Portal
              </Button>
              <Button
                onClick={() => {
                  // Direct trigger to swap view mode if 3D falls back
                  console.warn('Flat 2D rendering fallback triggered.');
                }}
                variant="outline"
              >
                Access Flat 2D Mode
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
