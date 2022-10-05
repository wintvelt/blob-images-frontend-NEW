const branch = process.env.NEXT_PUBLIC_BRANCH || 'dev';
const isMain = (branch === 'main');

const makeSwitch = (devValue, defaultValue) => (
    (!isMain) ? devValue : defaultValue
);

const gateway = () => makeSwitch(
    'https://api-dev.clubalmanac.com',
    'https://api.clubalmanac.com'
);

const bucket = () => makeSwitch(
    'blob-images-dev',
    'blob-images'
);

const userPool = () => makeSwitch(
    'eu-central-1_3N6XUNPAn',
    'eu-central-1_yZTQaYgj6'
);
const appClient = () => makeSwitch(
    '1rckvfb8fgkmilfpp541suknu7',
    '7h2946k07f1inl7026mson7sf1'
);
const identityPool = () => makeSwitch(
    'eu-central-1:26957302-975e-4f3e-ba2f-6a10e9030518',
    'eu-central-1:866124e3-9ec9-4b77-bdef-8f3c75e58d9b'
);

const config = {
    s3: {
        REGION: "eu-central-1",
        BUCKET: bucket()
    },
    apiGateway: {
        REGION: "eu-central-1",
        URL: gateway()
    },
    cognito: {
        REGION: "eu-central-1",
        USER_POOL_ID: userPool(),
        APP_CLIENT_ID: appClient(),
        IDENTITY_POOL_ID: identityPool()
    }
};

export const amplifyConfig = {
    Auth: {
        mandatorySignIn: false,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
        region: config.s3.REGION,
        bucket: config.s3.BUCKET,
        identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    API: {
        endpoints: [
            {
                name: "blob-images",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION,
            },
            {
                name: "invite",
                endpoint: 'https://pzmvrfc9ml.execute-api.eu-central-1.amazonaws.com/dev',
                region: config.apiGateway.REGION,
            }
        ]
    }
};