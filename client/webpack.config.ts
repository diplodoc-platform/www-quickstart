import { EnvironmentPlugin } from 'webpack';

type Env = {
    isServer: boolean;
}

const config = ({ isServer }: Env) => {
    return {
        entry: [
            './document'
        ],
        plugins: [
            new EnvironmentPlugin({
                'process.env': {
                    SERVER: isServer
                }
            })
        ]
    };
};

export default [
    config({ isServer: true }),
    config({ isServer: false }),
];