import React, { Component, FC, JSXElementConstructor, PropsWithChildren } from 'react';
import { HandleError } from '@modelsjs/resolver';

export const Fallback: FC<{ error: Error }> = ({ error }) => {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={ { color: 'red' } }>{ error.message }</pre>
        </div>
    );
}

export class ErrorBoundary extends Component<
    PropsWithChildren<{ fallback: JSXElementConstructor<{ error: Error }> }>,
    { error: Error | null }
> {
    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    state = { error: null };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        if (error instanceof HandleError) {
            console.log(error.message, error.model);
        }
    }

    render() {
        if (this.state.error) {
            const Fallback = this.props.fallback;
            return (
                <Fallback error={ this.state.error }/>
            );
        }

        return this.props.children;
    }
}