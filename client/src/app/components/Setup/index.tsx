import type { PageContent } from '@gravity-ui/page-constructor';
import React from 'react';
import { useModel } from '@modelsjs/react';

import { Settings } from '~/models/settings';
import { isServer, isMobile } from '~/configs/env';
import { MobileProvider, ThemeProvider, Platform } from '@gravity-ui/uikit';
import { PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';

import { SetupSteps } from '../SetupSteps';
import { Repo } from '~/models/repo';
import { Project } from '~/models/project';
import { Navigation } from '~/models/navigation';

export const Setup = () => {
    const { theme } = useModel(Settings, {});
    const [ navigation ] = useModel(Navigation, true);
    const [ repo, repoError ] = useModel(Repo, { repo: 'diplodoc-example' }, true);
    const [ link, linkError ] = useModel(Project, {
        id: repo.id,
        repo: repo.name,
        owner: repo.owner,
    }, true);

    return (
        <MobileProvider mobile={ isMobile } platform={ Platform.BROWSER }>
            <ThemeProvider theme={ theme }>
                <PageConstructorProvider ssrConfig={ { isServer } }>
                    <PageConstructor
                        custom={ {
                            blocks: {
                                'steps': SetupSteps
                            }
                        } }
                        content={ {
                            blocks: [
                                {
                                    type: 'steps',
                                    repo: repoError ? null : repo,
                                    link: linkError ? null : link,
                                },
                            ]
                        } as PageContent }
                        navigation={ navigation }
                    />
                </PageConstructorProvider>
            </ThemeProvider>
        </MobileProvider>
    );
};