import React, { memo } from 'react';
import { Button, Icon, Link } from '@gravity-ui/uikit';

import * as user from '~/configs/user';
import { auth, base } from '~/configs/urls';

import GithubIcon from '~/assets/github.svg';
import * as cs from './index.module.css';
import i18n from '../../../i18n/configureLang';

const i18nK = i18n('main');

export const Authorize = memo(() => {
    if (!user.id) {
        return (
            <div className={ cs.step_body }>
                <span className={ cs.step_text }>{ i18nK(`auth`) }</span>
                <Link title={ i18nK(`github-auth`) } href={ base + auth + '/login/github' }>
                    <Button className={ cs.auth_button } size={ 'l' } view={ 'action' }>
                        <Button.Icon>
                            <Icon data={ GithubIcon } width={ '30px' } height={ '30px' }/>
                        </Button.Icon>
                        GitHub
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <Link className={ cs.auth_link } href={ user.link } target="_blank">
            <img className={ cs.auth_link_avatar } src={ user.avatar } alt="" width={ '30px' } height={ '30px' }/>
            <span>{ user.name || user.login }</span>
        </Link>
    )
});