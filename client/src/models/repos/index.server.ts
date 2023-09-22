import { App, Octokit } from 'octokit';
import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { Repos as Base, Repo, Installation, Owner } from './repos';

import { appId } from '~/configs/env';
import { accessToken, appPem } from '~/configs/server';

export { Repo, Owner, Installation };

export const gh = new App({
    appId: appId,
    privateKey: appPem,
});

@resolvable(Server)
export class Repos extends Base {
    static async action() {
        if (!accessToken) {
            return {};
        }

        const ukit = new Octokit({
            auth: accessToken
        });

        const { data } = await ukit.request('GET /user/installations', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const owners: Record<number, Owner> = {};
        const repos: Record<number, Repo> = {};
        const tree: Record<number, number[]> = {};

        await Promise.all(data.installations.filter((inst) => inst.app_id === appId).map(async ({ id, html_url: url }) => {
            const akit = await gh.getInstallationOctokit(id);

            const { data: { repositories } } = await akit.request('GET /installation/repositories');

            repositories.forEach((repo) => {
                console.log(repo);

                owners[repo.owner.id] = owners[repo.owner.id] || {
                    type: repo.owner.type,
                    name: repo.owner.login,
                    avatar: repo.owner.avatar_url,
                    url: repo.owner.html_url,
                    installation: { id, url } as Installation,
                };

                repos[repo.id] = {
                    id: repo.id,
                    name: repo.name,
                    owner: repo.owner.login,
                    url: repo.html_url,
                    main: repo.default_branch,
                    installation: { id, url } as Installation,
                } as Repo;

                tree[repo.owner.id] = tree[repo.owner.id] || [];
                tree[repo.owner.id].push(repo.id);
            });
        }));

        return {
            tree,
            repos: Object.values(repos),
            owners: Object.values(owners),
        };
    }
}