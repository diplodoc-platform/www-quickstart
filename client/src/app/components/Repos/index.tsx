import React, { useCallback } from 'react';
import {useModel} from '@modelsjs/react';

import {Repos, Repo} from '~/models/repos';

import * as cs from './index.module.css';

export const ReposPage = () => {
    const repos = useModel(Repos);

    return <div>
        {repos.repos.map((repo) => {
            return (
                <RepoItem key={repo.owner + '/' + repo.name} {...repo} />
            );
        })}
    </div>
}

const RepoItem = (repo: Repo) => {
    const onClick = useCallback(async () => {
        const request = await fetch('/api/attach-actions', {
            method: 'post',
            body: JSON.stringify(repo),
            headers: {
                'content-type': 'application/json'
            }
        });

        return request.json();
    }, [repo]);

    return (
        <div className={cs.repo} onClick={onClick}>{repo.owner}/{repo.name}</div>
    );
}