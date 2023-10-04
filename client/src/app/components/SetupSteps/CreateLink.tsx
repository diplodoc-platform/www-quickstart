import React, { memo, useCallback, useState } from 'react';
import { useModel } from '@modelsjs/react';
import { Repo } from '~/models/repo';
import { Project } from '~/models/project';
import { ModelError, set } from '@modelsjs/model';
import { Button, Link } from '@gravity-ui/uikit';

import * as cs from './index.module.css';

export const CreateLink = memo(() => {
    const [ repo ] = useModel(Repo, { repo: 'diplodoc-example' }, true);
    const [ link, error ] = useModel(Project, {
        id: repo.id,
        repo: repo.name,
        owner: repo.owner,
    }, true);
    const [ loading, setLoading ] = useState(false);

    const onClick = useCallback(async () => {
        setLoading(true);

        const request = await fetch('/api/actions/create-link', {
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
            set(link, response.data);
        } else if (response.error) {
            set(link, new ModelError(link, response.error));
        }
    }, [ setLoading ]);

    if (error) {
        if (error.code !== 'NOTFOUND') {
            return error.message;
        }

        return (
            <div className={ cs.step_body }>
                <div className={ cs.repo_text }>
                    Будет создан проект<br/>
                    gh-{ repo.id }
                </div>
                <Button className={ cs.repo_button } size={ 'l' } view={ 'action' }
                        loading={ loading }
                        onClick={ onClick }>
                    Создать
                </Button>
            </div>
        );
    }

    return (
        <Link className={ cs.auth_link } href={ link.link } target="_blank">{ link.name }</Link>
    )
});