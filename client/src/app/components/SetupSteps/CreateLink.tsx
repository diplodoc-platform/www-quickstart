import React, {memo, useCallback, useState} from 'react';
import { useModel } from '@modelsjs/react';
import { Repo } from '~/models/repo';
import { Project } from '~/models/project';
import { ModelError, set } from '@modelsjs/model';
import { Button, Link, Progress, Modal, CopyToClipboard, CopyToClipboardStatus, Tooltip, Icon } from '@gravity-ui/uikit';
import {Copy} from '@gravity-ui/icons';

import * as user from '~/configs/user';
import { api, base } from '~/configs/urls';

import * as cs from './index.module.css';
import i18n from '../../../i18n/configureLang';

const i18nK = i18n('main');

type AnchorButtonComponentProps = {
    size?: number;
    className?: string;
    status: CopyToClipboardStatus;
    qa?: string;
};

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
            {loading && <Progress className={cs.progress_bar} text={i18nK(`loading`)} theme="success" size={'s'} value={progress}
                       loading={loading}/>}
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
        console.error(error.message);
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
                {project.creds && <SecretsModal data={project.creds}/>}
            </div>
        );
    } else {
        return (
            <div className={ cs.project }>
                {i18nK('available-at')} <Link className={ cs.project_link } href={ project.link } target="_blank">{i18nK('link')}</Link>
                {project.creds && <SecretsModal data={project.creds}/>}
            </div>
        );
    }
});

const AnchorButtonComponent = ({size = 15, className, status, onClick, qa}: AnchorButtonComponentProps) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    return (
        <Tooltip content={status === CopyToClipboardStatus.Success ? i18nK('copied') : i18nK('copy')}>
            <Button ref={buttonRef} view="flat" className={className} onClick={onClick} qa={qa}>
                <Icon size={size} data={Copy} />
            </Button>
        </Tooltip>
    );
};

const SecretsModal = ({data: {accessKeyId, secretAccessKey}}) => {
    const [ open, setOpen ] = useState(Boolean(accessKeyId));

    return (<Modal open={open} onClose={() => setOpen(false)} contentClassName={cs.modal}>
        <span>{i18nK('key-title')}</span>
        <span className={cs.key_text}>{i18nK('key-id')}:</span>
        <div>
            {accessKeyId}
            <CopyToClipboard text={accessKeyId} timeout={500}>
                {(status) => (<AnchorButtonComponent status={status} qa="copy-button"/>)}
            </CopyToClipboard>
        </div>
        <span>{i18nK('secret-key')}:</span>
        <div>
            {secretAccessKey}
            <CopyToClipboard text={secretAccessKey} timeout={500}>
                {(status) => (<AnchorButtonComponent status={status} qa="copy-button"/>)}
            </CopyToClipboard>
        </div>
        <span className={cs.key_text}>{i18nK('key-description')}</span>
    </Modal>)
}
