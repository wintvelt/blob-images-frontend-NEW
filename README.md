#New Frontend for Clubalmanac

Using
- [x] [NextJs](nextjs.org)
- [x] [Material-UI](mui.com) using [example from github](https://github.com/mui/material-ui/tree/master/examples/nextjs)
- [ ] [Cypress](https://docs.cypress.io/guides/overview/why-cypress) for testing frontend e2e
- [ ] [Serverless]() to deploy to AWS
- [ ] [CircleCI]() or [Github Actions]() for CI/CD deployment

### How AUTH works
Every protected page needs
- `export ... getServerSideProps` to check server side if the user is authenticated, and to pass any user info to pageProps
- in the default export function:
    - a call in `useEffect` to `redirectUnAuth(pathname)` to catch client side navigation to protected page too, and navigate to login page if needed
- conditional rendering of the content
    - a loading screen if user is not authenticated, needed to prevent the client version to render before the async client side auth check is done

All this is bundled in the `Protected.js` component

The main _app contains a `UserContext` provider, that stores all user info.
The Context provider also has a client side useEffect, which checks if a user is authenticated. If so, it retrieves user info from the DB. This is done on client side in a useEffect, so only once, to prevent unnecessary API calls to the DB: if it would be done in `getServerSideProps`, next would make a db call on every page visited, even if the user details are already known client-side.
For the basic auth info, this is not needed, because the user details are passed to the server in the request context.


#### Usage
In the page file
``` js
    return (
        <Protected>
            // ...your page contents
        </Protected>
    )

```

Example for Serverside props:
``` js
export async function getServerSideProps(context) {
    const user = await getSSRUser(context);
    return {
        props: {
            user
        }
    }
}
```

For normal pages
- No need for SSR auth checking, this would unnecessarily slow down load time
- For the Login button/ User menu, the auth check is done client side - causing rerender if user is logged in

### Links
In links to protected pages,
- use the custom `ProtectedLink` component
- or the default `Link` component 
    - this will check - with `isProtectedRoute()` - if the destination is a protected route
    - you can force by adding a `isProtected={true}` prop

This will add a check if user is logged in.
If not, the link will not work and a toast will be shown.

### Redirects
Whenever a redirect takes place - e.g. someone not logged in visits a private page - they will be redirected to the login page, and a message appears (as a toast).

This is implemented as follows
- The `Protected component` uses a method `redirectUnAuth(pathname)`
    - if the user is not authenticated, a redirect is done to `/login`, and a (standard) message in a `toast` query
    - the redirect includes - in the query - the path the user was trying to go to
        - so that after login, the user can be redirected to that path
- `_app` has an effect, called whenever path changes, 
    - which checks if there is a toast in the pathname, 
    - and if so, displays the toast
    - so this can be shown on any page