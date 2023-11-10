import envconfig from './envconfig.js';

const ENV = {
    saId: envconfig.expectEnv('SA_ID')(),
    saAccessKey: envconfig.expectEnv('SA_ACCESS_ID')(),
    saPrivateKey: envconfig.expectEnv('SA_PRIVATE_KEY')().replace(/\\n/g, '\n'),
    saSupervisorId: envconfig.expectEnv('STORAGE_SUPERVISOR_SA')('ajeqk7ra0h8ni9jascao'),
    saResourceId: envconfig.expectEnv('FOLDER_ID')('b1g1j115gl75k4sqiu0m'),
    navigationEndpoint: envconfig.expectEnv('NAVIGATION_ENDPOINT')(),
    s3config: {
        endpoint: envconfig.expectEnv('S3_ENDPOINT')(),
        region: envconfig.expectEnv('S3_REGION')(),
        credentials: envconfig.expectEnv('S3_ACCESS_KEY')(),
    },
};

const commonBucket = envconfig({
    common: {
        commonBucketName: 'common',
        commonBucketEnv: 'stable'
    },
    development: {
        bucketEnv: 'unstable'
    }
})

export default (req) => ({
    api: {
        request: req.ctx.request.bind(req.ctx)
    },
    env: {
        isServer: true,
        isMobile: true,
        lang: req.lang || 'ru',
    },
    common: {
        gtmId: process.env.GTM_ID,
        nonce: req.nonce,
    },
    user: {
        ...req.auth,
        sign: req.csrf
    },
    server: {
        fetch: req.fetch,
        ...req.session,
        ...ENV,
        ...commonBucket,
    }
});
