import { API, Auth } from 'aws-amplify';

export default async function userQueryFn(_queryCtx) {
    const userData = await API.get('blob-images', `/user`);
    return userData
}

export const authQueryFn = async () => {
    try {
        await Auth.currentAuthenticatedUser();
        return true;
    } catch (_error) {
        return false;
    }
}