import { amplifyConfig } from "../../amplify.config";

const imageBaseUrl = 'https://img.clubalmanac.com/';

export const otoa = (object) => Buffer.from(JSON.stringify(object)).toString('base64');

export const makeImageUrl = (key, width, height) => {
    if (!key) return '';
    let body = {
        "bucket": amplifyConfig.Storage.bucket,
        "key": key
    }
    if (width || height) {
        let resize = { "fit": "cover" };
        if (width) resize.width = width;
        if (height) resize.height = height;
        body.edits = { resize };
    }
    const isRemote = (key.slice(0, 10) === 'protected/' || key.slice(0, 7) === 'public/');
    if (isRemote) {
        return imageBaseUrl + otoa(body);
    } else {
        return key;
    }
}
