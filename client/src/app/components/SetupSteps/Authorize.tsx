import React, { memo } from 'react';
import { useModel } from '@modelsjs/react';
import { User } from '~/models/user';
import { Button, Icon, Link } from '@gravity-ui/uikit';

import { auth } from '~/configs/urls';

import GithubIcon from '~/assets/github.svg';
import * as cs from './index.module.css';

export const Authorize = memo(() => {
    const [ user, error ] = useModel(User, true);

    if (error) {
        if (error.code === 'NOAUTH') {
            return (
                <div className={ cs.step_body }>
                    <span className={ cs.step_text }>Войти с помощью</span>
                    <Link title={ 'Войти с помощью GitHub' } href={ auth + '/login/github' }>
                        <Button className={ cs.auth_button } size={ 'l' } view={ 'action' }>
                            <Button.Icon>
                                <Icon data={ GithubIcon } width={ '30px' } height={ '30px' }/>
                            </Button.Icon>
                            GitHub
                        </Button>
                    </Link>
                </div>

            )
        } else {
            return <div>{ error.message }</div>;
        }
    }

    return (
        <Link className={ cs.auth_link } href={ user.link } target="_blank">
            <img className={ cs.auth_link_avatar } src={ user.avatar } alt="" width={ '30px' } height={ '30px' }/>
            <span>{ user.name || user.login }</span>
        </Link>
    )
});