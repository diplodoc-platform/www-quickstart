import React, { memo, useCallback, useState } from 'react';
import { useModel } from '@modelsjs/react';
import { ModelError, set } from '@modelsjs/model';
import { Button, Link } from '@gravity-ui/uikit';

import { Repo } from '~/models/repo';
import * as user from '~/configs/user';
import { api, base } from '~/configs/urls';

import * as cs from './index.module.css';
import i18n from "../../../i18n/configureLang";

const i18nK = i18n('main');

const EmptyCreateRepo = memo(({repo}: {repo: Repo}) => {
    const [ loading, setLoading ] = useState(false);

    const onClick = useCallback(async () => {
        setLoading(true);

        const request = await fetch(base + api + '/actions/create-repo', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'x-user-id': user.id,
                'x-csrf-token': user.sign,
            },
            body: JSON.stringify({
                name: 'diplodoc-example',
                template: 'diplodoc-platform/documentation-template',
            }),
        });

        const response = await request.json();

        if (response.data) {
            set(repo, response.data);
        } else if (response.error) {
            set(repo, new ModelError(repo, response.error));
        }

        setLoading(false);
    }, [ setLoading ]);

    return (
        <div className={ cs.step_body }>
            <div className={ cs.repo_text }>
                { i18nK(`project-created`)}<br/>
                { user.login }/diplodoc-example
            </div>
            <Button className={ cs.repo_button } size={ 'l' } view={ 'action' }
                    loading={ loading }
                    onClick={ onClick }>
                { i18nK(`create`)}
            </Button>
        </div>
    );
});

export const CreateRepo = memo(() => {
    const [ repo, error ] = useModel(Repo, { repo: 'diplodoc-example' }, true);

    if (error) {
        return error.message;
    }

    if (!repo.id) {
        return (
            <EmptyCreateRepo repo={repo} />
        );
    }

    return (
        <Link className={ cs.auth_link } href={ repo.link } target="_blank">{ repo.fullname }</Link>
    );
});

