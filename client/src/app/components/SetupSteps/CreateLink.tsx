import React, { memo, useCallback, useState } from 'react';
import { useModel } from '@modelsjs/react';
import { Repo } from '~/models/repo';
import { Project } from '~/models/project';
import { ModelError, set } from '@modelsjs/model';
import { Button, Link, Progress } from '@gravity-ui/uikit';

import * as user from '~/configs/user';
import { api, base } from '~/configs/urls';

import * as cs from './index.module.css';
import i18n from '../../../i18n/configureLang';

const i18nK = i18n('main');

const EmptyCreateLink = memo(({ repo, project }: { repo: Repo, project: Project }) => {
    const [ loading, setLoading ] = useState(false);
    const [ progress, setProgress ] = useState(0);

    const onClick = useCallback(async () => {
        setLoading(true);
        const interval = setInterval(() => setProgress((oldCount) => oldCount + 1), 200);

        const request = await fetch(base + api + '/actions/create-link', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'x-user-id': user.id,
                'x-csrf-token': user.sign,
            },
            body: JSON.stringify({
                id: repo.id,
                repo: repo.name,
                owner: repo.owner,
            }),
        });

        const response = await request.json();

        if (response.data) {
            set(project, response.data);
        } else if (response.error) {
            set(project, new ModelError(project, response.error));
        }

        clearInterval(interval);
        setLoading(false);
    }, [ setLoading ]);

    return (
        <div className={ cs.step_body }>
            <div className={ cs.repo_text }>
                { i18nK(`project-created`) }<br/>
                gh-{ repo.id }
            </div>
            <Button className={ cs.repo_button } size={ 'l' } view={ 'action' }
                    loading={ loading }
                    onClick={ onClick }>
                { i18nK(`create`) }
            </Button>
            <Progress className={ cs.progress_bar } text={ i18nK(`loading`) } theme="success" size={'s'} value={progress} loading={loading} />
        </div>
    );
});

export const CreateLink = memo(() => {
    const [ repo ] = useModel(Repo, { repo: 'diplodoc-example' }, true);
    const [ project, error ] = useModel(Project, {
        id: repo.id,
        repo: repo.name,
        owner: repo.owner,
    }, true);

    if (error) {
        return error.message;
    }

    if (!project.id) {
        return (
            <EmptyCreateLink repo={ repo } project={ project }/>
        );
    }

    if (project.deploy) {
        return (
            <div className={ cs.project }>
                {i18nK('after-finishing')}
                <Link className={ cs.project_link } href={ project.deploy.link } target="_blank">
                    {i18nK('release')}
                </Link>
                <br/>
                {i18nK('will-be-available')}
                <Link className={ cs.project_link } href={ project.link } target="_blank">
                    {i18nK('link')}
                </Link>.
            </div>
        );
    } else {
        return (
            <div className={ cs.project }>
                {i18nK('available-at')} <Link className={ cs.project_link } href={ project.link } target="_blank">{i18nK('link')}</Link>
            </div>
        );
    }
});