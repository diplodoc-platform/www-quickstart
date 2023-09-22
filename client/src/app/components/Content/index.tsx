import { NavigationData, PageContent } from '@gravity-ui/page-constructor';
import React, { useEffect } from 'react';
import { useModel } from '@modelsjs/react';
import { User } from '~/models/user';
import { Settings } from '~/models/settings';
import { isServer, isMobile } from '~/configs/env';
import { MobileProvider, ThemeProvider, Platform } from '@gravity-ui/uikit';
import { PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';

import {ReposPage} from '../Repos';

const LEFT_NAV = [
    {
        text: 'Link3',
        type: 'link',
        url: 'https://example.com'
    },
    {
        text: 'Link4',
        type: 'link',
        url: 'https://example.com'
    }
];

const RIGHT_NAV = [
    {
        label: 'Star @gravity-ui/page-constructor on GitHub',
        text: 'Star',
        type: 'github-button',
        url: 'https://github.com/gravity-ui/page-constructor'
    }
] as NavigationData['rightItems'];

export const Content = () => {
    const user = useModel(User, {});
    const { theme } = useModel(Settings, {});

    useEffect(() => {
        console.log('env', { isServer, isMobile });
    }, []);

    return (
        <MobileProvider mobile={ isMobile } platform={ Platform.BROWSER }>
            <ThemeProvider theme={ theme }>
                <PageConstructorProvider ssrConfig={ { isServer } } theme="dark">
                    <PageConstructor
                        custom={{
                            blocks: {
                                'repos': ReposPage
                            }
                        }}
                        content={ {
                            background: {
                                dark: {
                                    color: '#262626',
                                    fullWidthMedia: true,
                                    image: 'https://storage.yandexcloud.net/cloud-www-assets/constructor/storybook/images/header-bg-video_dark.png',
                                    parallax: false
                                },
                                light: {
                                    color: '#EFF2F8',
                                    fullWidthMedia: true,
                                    image: 'https://storage.yandexcloud.net/cloud-www-assets/constructor/storybook/images/header-bg-video_light.png',
                                    parallax: false
                                }
                            },
                            blocks: [
                                {
                                    type: 'repos'
                                },
                                {
                                    type: 'header-block',
                                    buttons: [
                                        {
                                            text: 'Attach project',
                                            theme: 'action',
                                            url: 'https://github.com/apps/modelsjs/installations/new'
                                        }
                                    ],
                                    description: '<p> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p> ',
                                    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                                    verticalOffset: 'm',
                                    width: 'm'
                                },
                            ]
                        } as PageContent }
                        navigation={ {
                            header: {
                                leftItems: LEFT_NAV,
                                rightItems: (RIGHT_NAV.concat(user.id ? {
                                    label: 'Signed In with GitHub',
                                    icon: user.avatar,
                                    text: user.name || user.login,
                                    type: 'link',
                                    url: user.link
                                } : {
                                    label: 'Sign In with GitHub',
                                    text: 'Sign In',
                                    theme: 'github',
                                    size: 'l',
                                    type: 'button',
                                    url: '/login/github'
                                }))
                            },
                            logo: {
                                dark: {
                                    icon: 'https://storage.yandexcloud.net/cloud-www-assets/constructor/storybook/images/icon_1_dark.svg',
                                    text: 'ModelsJS'
                                },
                                light: {
                                    text: 'ModelsJS',
                                    icon: 'https://storage.yandexcloud.net/cloud-www-assets/constructor/storybook/images/icon_1_light.svg',
                                },
                            }
                        } as NavigationData }
                    />
                </PageConstructorProvider>
            </ThemeProvider>
        </MobileProvider>
    );
};