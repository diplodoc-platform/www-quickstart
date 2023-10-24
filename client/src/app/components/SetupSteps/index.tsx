import React, { useState, useEffect, FC, PropsWithChildren, JSXElementConstructor } from 'react';

import { Resolver } from '@modelsjs/react';

import cn from 'classnames';
import { ErrorBoundary } from 'react-error-boundary';

import { Authorize } from './Authorize';
import { CreateRepo } from './CreateRepo';
import { CreateLink } from './CreateLink';

import * as user from '~/configs/user';

import { resolvers } from '../../resolvers';
import i18n from "../../../i18n/configureLang";

import * as cs from './index.module.css';

const i18nK = i18n('main');

const Step: FC<PropsWithChildren<{
    title: string;
    state: {
        active: boolean;
        finished: boolean;
    };
    step: JSXElementConstructor<any>
}>> = ({ title, state, step: Step }) => {
    return (
        <Resolver fallback={ 'Loading...' } resolvers={ resolvers }>
            <ErrorBoundary fallbackRender={ ({ error }) => error.message }>
                <li className={ cn(cs.step, {
                    [cs.step__active]: state.active,
                    [cs.step__finished]: state.finished,
                }) }>
                    <span className={ cn(cs.step_title, {
                        [cs.step_title__small]: state.active || state.finished
                    }) }>{ title }</span>
                    { state.active || state.finished ? <Step state={ state }/> : null }
                </li>
            </ErrorBoundary>
        </Resolver>
    );
}

export const SetupSteps = ({ repo, link }) => {
    const userId = user?.id;
    const repoId = repo?.id;
    const linkId = link?.id;

    const _auth = {
        active: !userId,
        finished: Boolean(userId)
    };
    const [ _repo, setRepo ] = useState({
        active: Boolean(userId),
        finished: Boolean(repoId)
    });
    const [ _link, setLink ] = useState({
        active: Boolean(repoId),
        finished: Boolean(linkId)
    });

    useEffect(() => {
        setRepo({
            active: Boolean(userId),
            finished: Boolean(repoId)
        });
    }, [ repoId, userId ])

    useEffect(() => {
        setLink({
            active: Boolean(repoId),
            finished: Boolean(linkId)
        });
    }, [ linkId, repoId ])

    return (
        <div className={ cs.root }>
            <div className={ cs.content }>
                <h1 className={ cs.title }>{ i18nK('quickstart')}</h1>
                <ul className={ cs.steps }>
                    <Step title={ i18nK('login') } state={ _auth } step={ Authorize }/>
                    <Step title={  i18nK('repository') } state={ _repo } step={ CreateRepo }/>
                    <Step title={ i18nK('project') } state={ _link } step={ CreateLink }/>
                </ul>
            </div>
        </div>
    )
}