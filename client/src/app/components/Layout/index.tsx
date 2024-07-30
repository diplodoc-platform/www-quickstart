import type { PageContent } from '@gravity-ui/page-constructor';
import React, { FC, PropsWithChildren } from 'react';
import { useModel } from '@modelsjs/react';

import { Settings } from '~/models/settings';
import { isServer, isMobile } from '~/configs/env';
import { MobileProvider, ThemeProvider, Platform } from '@gravity-ui/uikit';
import { PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';

import { Navigation } from '~/models/navigation';
import * as env from '~/configs/env';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
    const { theme } = useModel(Settings);
    const navigation = useModel(Navigation, { lang: env.lang });

    return (
        <MobileProvider mobile={ isMobile } platform={ Platform.BROWSER }>
            <ThemeProvider theme={ theme }>
                <PageConstructorProvider ssrConfig={ { isServer } }>
                    <PageConstructor
                        custom={ {
                            blocks: {
                                'content': () => children
                            }
                        } }
                        content={ {
                            blocks: [ { type: 'content' } ]
                        } as PageContent }
                        navigation={ navigation }
                    />
                </PageConstructorProvider>
            </ThemeProvider>
        </MobileProvider>
    );
};