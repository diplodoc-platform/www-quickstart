import {Session} from '@yandex-cloud/nodejs-sdk';
import {saId, saAccessKey, saPrivateKey} from '~/configs/server';

// import envconfig from '../../utils/envconfig.js';
//
// const serviceAccountId = envconfig.expectEnv('SA_ID')();
// const accessKeyId = envconfig.expectEnv('SA_ACCESS_ID')();
// const privateKey = envconfig.expectEnv('SA_PRIVATE_KEY')();

const serviceAccountJson = {
    serviceAccountId: saId,
    accessKeyId: saAccessKey,
    privateKey: saPrivateKey,
};

export default function () {
    return new Session({serviceAccountJson});
};
