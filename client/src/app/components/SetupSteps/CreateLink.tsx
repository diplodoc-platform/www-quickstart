import React, { memo, useCallback, useState } from 'react';
import { useModel } from '@modelsjs/react';
import { Repo } from '~/models/repo';
import { Project } from '~/models/project';
import { ModelError, set } from '@modelsjs/model';
import { Button, Link } from '@gravity-ui/uikit';

import { api, base } from '~/configs/urls';

import * as cs from './index.module.css';
import i18n from "../../../i18n/configureLang";

const i18nK = i18n('main');

export const CreateLink = memo(() => {
    const [ repo ] = useModel(Repo, { repo: 'diplodoc-example' }, true);
    const [ project, error ] = useModel(Project, {
        id: repo.id,
        repo: repo.name,
        owner: repo.owner,
    }, true);
    const [ loading, setLoading ] = useState(false);

    const onClick = useCallback(async () => {
        setLoading(true);

        const request = await fetch(base + api + '/actions/create-link', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id: repo.id,
                repo: repo.name,
                owner: repo.owner,
            }),
        });

        const response = await request.json();

        setLoading(false);

        if (response.data) {
            set(project, response.data);
        } else if (response.error) {
            set(project, new ModelError(project, response.error));
        }
    }, [ setLoading ]);

    if (error) {
        if (error.code !== 'NOTFOUND') {
            return error.message;
        }

        return (
            <div className={ cs.step_body }>
                <div className={ cs.repo_text }>
                    { i18nK(`project-created`)}<br/>
                    gh-{ repo.id }
                </div>
                <Button className={ cs.repo_button } size={ 'l' } view={ 'action' }
                        loading={ loading }
                        onClick={ onClick }>
                    { i18nK(`create`)}
                </Button>
            </div>
        );
    }

    return (
        <div className={cs.project}>
            Будет доступен по <Link className={ cs.project_link } href={ project.link } target="_blank">ссылке</Link>
            <br/>
            после завершения <Link className={ cs.project_link } href={ project.deploy.link } target="_blank">релиза</Link>.
        </div>
    )
});