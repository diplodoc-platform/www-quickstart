
type Props = {
    owner: string;
    repo: string;
};

export async function ResolveDeploy({ owner, repo }: Props) {
    return {
        state: 'progress'
    };
}

ResolveDeploy.displayName = 'resolve-deploy';