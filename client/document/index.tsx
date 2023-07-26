import type { FC, ComponentType } from 'react';
import React from 'react';
import { renderToString } from 'react-dom/server';

type Props = {
    App: ComponentType
};

const Document: FC<Props> = ({ App }) => {
    return (
        <html>
        <body>
            <App></App>
        </body>
        </html>
    );
};

export function render(props: Props) {
    if (process.env.SERVER) {
        return renderToString(<Document {...props} />);
    } else {
        throw new Error('This is server component only!');
    }
}