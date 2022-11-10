import * as React from 'react';
import { withSSRContext } from 'aws-amplify';

export async function isAuthUser(context) {
    // if user is logged in, SSR will get it from context
    const { Auth } = withSSRContext(context)
    try {
        const authResult = await Auth.currentAuthenticatedUser();
        return true;
    } catch (err) {
        return false;
    }
}