import {serviceClients, cloudApi} from '@yandex-cloud/nodejs-sdk';
import Session from './session';

const {
    storage: {
        bucket_service: {UpdateBucketRequest, GetBucketRequest},
    },
} = cloudApi;

export default function () {
    const session = new Session();
    const bucketServiceClient = session.client(serviceClients.BucketServiceClient);

    return {
        policy: {
            async allow({bucket, prefix, users, action}) {
                const resourceName = [bucket, prefix].join('/');

                const {policy} = await bucketServiceClient.get(
                    GetBucketRequest.fromPartial({name: bucket}),
                );

                if (!policy) {
                    return;
                }

                const newStatement = {
                    Effect: 'Allow',
                    Sid: `Statement Allow for ${users.join(', ')}`,
                    Principal: {
                        CanonicalUser: users,
                    },
                    Action: action,
                    Resource: [`arn:aws:s3:::${resourceName}/*`, `arn:aws:s3:::${resourceName}`],
                };

                updatePolicy({policy, statement: newStatement, bucket});

                return bucketServiceClient.update(
                    UpdateBucketRequest.fromPartial({
                        name: bucket,
                        fieldMask: {
                            paths: ['policy'],
                        },
                        policy,
                    }),
                );
            },
        },
    };
};

function updatePolicy({policy, statement, bucket}) {
    if (Array.isArray(policy.Statement)) {
        policy.Statement.push(statement);
    } else if (typeof policy.Statement === 'object') {
        policy.Statement = [policy.Statement, statement];
    } else {
        throw new Error(`There are no policy statements for bucket ${bucket}`);
    }

    const sids = {};
    policy.Statement = policy.Statement.filter(function (statement) {
        if (sids[statement.Sid]) {
            return false;
        }
        sids[statement.Sid] = true;
        return true;
    });
}
