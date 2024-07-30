import React, {MutableRefObject} from 'react';

import {Portal} from '@gravity-ui/uikit';
import {Button, ButtonProps, Grid, Row, YFMWrapper} from '@gravity-ui/page-constructor';

import * as cs from './popup.module.css';

export type ConsentButtonsPopupProps = Record<'decline' | 'accept', ButtonProps>;

export interface ConsentPopupData {
    text: string;
    buttons: ConsentButtonsPopupProps;
}

export interface ConsentPopupProps extends ConsentPopupData {
    onAction: (accepted: boolean) => void;
    containerRef?: MutableRefObject<HTMLDivElement | null>;
}

/**
 * Analytics consent popup component
 *
 * @param text - popup text
 * @param buttons - actions buttons
 * @param onAction - callback for actions
 * @param containerRef - ref, for get opportunity to link to this component
 *
 * @returns -jsx
 */
export const ConsentPopup: React.FC<ConsentPopupProps> = ({
    text,
    buttons = {},
    onAction,
    containerRef,
}) => (
    <Portal>
        <div ref={containerRef}>
            <Grid className={cs.consent_popup}>
                <Row className={cs.container}>
                    <YFMWrapper
                        content={text}
                        modifiers={{
                            constructor: true,
                        }}
                    />
                    <div className={cs.buttons}>
                        {Object.entries(buttons).map(([key, value]) => (
                            <Button
                                {...value}
                                key={key}
                                className={cs.button}
                                onClick={() => onAction(key === 'accept')}
                            />
                        ))}
                    </div>
                </Row>
            </Grid>
        </div>
    </Portal>
);
