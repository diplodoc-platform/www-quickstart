import React, { memo, useCallback, useState } from 'react';
import { useModel } from '@modelsjs/react';
import { ModelError, set } from '@modelsjs/model';
import { User } from '~/models/user';
import { Repo } from '~/models/repo';

import { Button, Link } from '@gravity-ui/uikit';

import { api } from '~/configs/urls';

import * as cs from './index.module.css';

export const CreateRepo = memo(() => {
    const [ user ] = useModel(User, true);
    const [ repo, error ] = useModel(Repo, { repo: 'diplodoc-example' }, true);
    const [ loading, setLoading ] = useState(false);

    const onClick = useCallback(async () => {
        setLoading(true);

        const request = await fetch(api + '/actions/create-repo', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name: 'diplodoc-example',
                template: 'diplodoc-platform/documentation-template',
            }),
        });

        const response = await request.json();

        setLoading(false);

        if (response.data) {
            set(repo, response.data);
        } else if (response.error) {
            set(repo, new ModelError(repo, response.error));
        }
    }, [ setLoading ]);

    if (error) {
        if (error.code === 'NOTFOUND') {
            return (
                <div className={ cs.step_body }>
                    <div className={ cs.repo_text }>
                        Будет создан репозиторий<br/>
                        { user.login }/diplodoc-example
                    </div>
                    <Button className={ cs.repo_button } size={ 'l' } view={ 'action' }
                            loading={ loading }
                            onClick={ onClick }>
                        Создать
                    </Button>
                </div>
            );
        } else {
            return error.message;
        }
    }

    return (
        <Link className={ cs.auth_link } href={ repo.link } target="_blank">{ repo.fullname }</Link>
    )
});

