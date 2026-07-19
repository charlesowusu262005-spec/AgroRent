/**
 * @file        ErrorBoundary.tsx
 * @feature     Core
 * @description Catches uncaught React render errors and shows a recoverable fallback instead of a white screen.
 * @data        Presentational — logs to console in componentDidCatch.
 * @consumes    Button
 * @author      MiStarStudio
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Class boundary required by React — function components cannot implement getDerivedStateFromError.
 * Restart clears local error state; a full reload would need expo-updates in production.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error boundary caught:', error, info.componentStack);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          className="flex-1 items-center justify-center bg-background px-8"
          accessibilityRole="alert"
          accessibilityLabel="Something went wrong"
        >
          <Text className="text-2xl font-bold text-text-primary">Something went wrong</Text>
          <Text className="mt-3 text-center text-base text-text-secondary">
            The app ran into an unexpected error. Please try restarting.
          </Text>
          <View className="mt-8 w-full">
            <Button label="Restart App" onPress={this.handleRestart} fullWidth />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
