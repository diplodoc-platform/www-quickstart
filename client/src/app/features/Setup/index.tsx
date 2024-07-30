import React from 'react';
import { useModel } from '@modelsjs/react';
import { Steps } from './Steps';
import { Repo } from '~/models/repo';
import { Project } from '~/models/project';

export const Setup = () => {
    const [ repo, repoError ] = useModel(Repo, { repo: 'diplodoc-example' }, true);
    const [ link, linkError ] = useModel(Project, {
        id: repo.id,
        repo: repo.name,
        owner: repo.owner,
    }, true);

    return (
        <Steps
            repo={repoError ? null : repo}
            link={linkError ? null : link}
        />
    );
};