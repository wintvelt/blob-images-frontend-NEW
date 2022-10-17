# New Frontend for Clubalmanac

Using
- [x] [NextJs](nextjs.org)
- [x] [Material-UI](mui.com) using [example from github](https://github.com/mui/material-ui/tree/master/examples/nextjs)
- [ ] [Cypress](https://docs.cypress.io/guides/overview/why-cypress) for testing frontend e2e
- [ ] [Serverless]() to deploy to AWS
- [ ] [CircleCI]() or [Github Actions]() for CI/CD deployment

### How AUTH works
Every protected page needs
- `export ... getServerSideProps` to check server side if the user is authenticated, and to pass any user info to pageProps
    - should also be included on public pages, because every page displays navbar with user menu
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

#### Auth pages
For auth, pages are (all located in root)
- [ ] `login.js` - login form + create account form
    - [x] implement forgotpsw - simple link to forgotpsw page
    - [x] has createaccount form, to complete account after login with tmp password
    - [ ] catch other challenges and errors
- [ ] `forgotpassword.js` - user triggered when they forgot psw, allows user to ask to reset psw
    - [x] extract AuthWrapper - page layout
    - [x] new page for forgotPsw.js
    - [ ] redirect to setpassword
- [ ] `setpassword.js` - to set a new password, follow-up on email to user with verification code
    - [ ] new page
    - [x] create NewPassWordField - with nice validation lines
    - [ ] create verification code field
    - [ ] extract verfication code server side from query
- [ ] `signup.js` - allows user to sign up
    - the url should contain a query parameter `inviteid`
        - this is passed to cognito on signup
        - the cognito backend preSignup lambda verifies the inviteId (unless env vars allow direct signup)
    - after signup user is redirected to the verify page
- [ ] `verify.js` - form to verify user email address, follow-up on mail with verification code

### Invites
- The invite route has an `inviteId`.
    - used in getServerSideProps to fetch the invite from the server (this is a public API)
- At creation, the invite is addressed to an email. The backend (in api-groups) handles as follows
    - checks if the invitor is a member of the group + has admin priviliges - otherwise throws error
    - checks if the group size (env var) would not be exceeded - otherwise, throws error
    - checks if the invitee email is already a user, and if so
        - if the invitee is already member of the group, or already has an active invite - throws error
    - the user id for the invitee will be
        - userId if the invitee is already user
        - the email address otherwise
    - in the db, the invite will be stored as a membership record with invite status
    - the `inviteId` for the frontend - included in email to invitee - is the encoded PK and SK of the invite record
- Possible cases for the invite page, based on response from getting invite from DB:
    - `"invite ID invalid"` or `"invite not found"` -> display error
    - `"invite not for you"`
        - if user is logged in: invite is for another user -> do not allow acceptance
        - if user is not logged in: invite is for an existing user -> prompt to log in
    - `"invite already accepted"`: invite is already accepted  -> show message
    - `"invite expired"`: invite expired -> show message
    - check if invite is for an email, and if so
        - if user is logged in -> allow acceptance with warning if email address is different
        - if user is not logged in -> allow signup
    - otherwise invite must be for this logged in user -> allow acceptance


### How nav works
Every page needs a `getServerSideProps`, 
- to retrieve the route from the request, and populate props with `path`, and - if relevant - `groupId`, `albumId`,  `backRoute`
- these are used by the `NavBar` and `NavBar-Left` components, to render the right back links
- The db data with names for Group and Album are retrieved at client side, to prevent unnecessary db calls

`route-helpers` exposes a `getSSRRoute()` function, that can be called as follows
``` js
export async function getServerSideProps(context) {
    const user = await getSSRUser(context);
    const routeData = getSSRRoute(context)
    return {
        props: {
            user,
            ...routeData
        }
    }
}
```

### Links
In links to protected pages,
- the custom `Link` component 
    - will check - with `isProtectedRoute()` - if the destination is a protected route
    - you can force this by adding a `isProtected={true}` prop
- or you can use the custom `ProtectedLink` component to make it more explicit

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

### Personal pages
The following pages (routes) show a personal header:
- `/groups`
- `/photos`
- `/profile`
- `/account`

These pages import a `PersonalHeader` component, shown at the top of the page. This component includes
- User info - from `useUser()`
- Tab bar with links to the personal pages

The regular page content is shown below the personal header.