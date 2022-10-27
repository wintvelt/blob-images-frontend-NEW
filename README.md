# New Frontend for Clubalmanac

Using
- [x] [NextJs](nextjs.org)
- [x] [Material-UI](mui.com) using [example from github](https://github.com/mui/material-ui/tree/master/examples/nextjs)
- [x] [Cypress](https://docs.cypress.io/guides/overview/why-cypress) for testing frontend e2e
- [ ] [Serverless]() to deploy to AWS
- [ ] [CircleCI]() or [Github Actions]() for CI/CD deployment

General
- [ ] catch useQuery error states

## How AUTH works
### User state management
Currently in `Context`
- `UserContext` in Components, and a usercontext provider at _app level
- LoginForm calls Login function
- Logout function in UserMenu calls logout

Amplify `Auth` is called in
- `UserContext`: `.currentAuthenticatedUser()`
- `Protected` Page wrapper: 
    - `.currentAuthenticatedUser()` in SSR function
- `CreateAccountForm`: `.completePassword()`
- `ForgotPasswordForm`: `.forgotPassword()`
- `LoginForm`: `.signIn()`
- `SetPasswordForm`:
    - `.SignIn()`
    - `.forgotPassword()`
    - `.forgotPasswordSubmit()`
- `NavBar-UserMenu`: `.signOut()`

How this works on load:
- a page that is loaded *may* receive a `user` prop from the server
    - a page may include the `Protected` wrapper
    - if so, it should also include the SSR function for user
    - which at server side checks (from the context) if the user is logged in
    - and if so, sends the Auth user as a prop to the page
- the page prop user contains *only* the Auth info about the user - so e.g. not the photourl
- the page prop is passed as `ssrUser` to the `UserContext`
- `UserContext` is a context provider that stores user info

This setup with `Context` does not use react-query. So it is OK that the usercontext is rendered outside the QueryContext in `_app`.

Using react-query for user state is not ideal: the fact that the initialstate is provided in props means that we need either a) pass the ssrUser from props down to every component that calls `useUser()` or b) set up complicated stuff with hydration and dehyrdation. For more info, see [here](https://tanstack.com/query/v4/docs/guides/ssr).

### Protected pages
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
- [x] `login.js` - login form + create account form
    - [x] implement forgotpsw - simple link to forgotpsw page
    - [x] has createaccount form, to complete account after login with tmp password
    - [x] catch other challenges and errors
    - [x] account creation as separate page **rejected**:
        - it would allow a link directly from an mail, with email and tmp-password already set
        - so that the login with tmp-password step could be skipped
        - but tmp-password would need to be in the link/ query, which is unsafe
    - [ ] (link to) redirect on succesful login
- [x] `forgotpassword.js` - user triggered when they forgot psw, allows user to ask to reset psw
    - basic:
        - user fills in email and sends form
        - backend sends and email with a verification code
        - frontend meanwhile switches to state to accept verifcation code
        - user fills in verification code and new password
        - user is redirected to groups page
    - [x] extract AuthWrapper - page layout
    - [x] new page for forgotPsw.js
    - [x] setpassword is implemented on same page
    - [x] test various scenarios
    - [x] it should be possible to navigate from scratch to page with verification code
    - [x] after verification, a success message is shown, with link to go to groups page
- [ ] `signup.js` - allows user to sign up
    - the url should contain a query parameter `inviteid`, unless direct signup is allowed
        - this is passed to cognito on signup
            - inviteId is the otob (from blob-common) of the `{ PK, SK }` object of the invite
        - the cognito backend preSignup lambda verifies the inviteId (unless env vars allow direct signup)
        - [ ] backend `api-user-createUser` handler should - in case of creation - also accept/ confirm membership based on the invite
            - [ ] call/ do stuff that accept-invite API does
            - [ ] ensure that legacy stuff continues to work
                - cannot be a date, users may still sign up after a date
                - [ ] in Cognito user pool, add custom attribute `autoAccept` boolean
                - [ ] in new frontend, send this with custom data
                - [ ] in `api-user-createUser`, check for this attribute, and if true, accept the invite
    - after signup user is shown succes message with link to the verification form
        - user receives an email with a verification code
        - verification form has email + code
        - after submit, a message is displayed that verification is complete
            - or error message with option to resend verification code
    - to develop/ test
        - [ ] create the signup page
        - [ ] verify page - cannot be auto-tested, because it needs key from email
- [ ] `verify.js` - form to verify user email address, follow-up on mail with verification code
    - [ ] email and code can be in query parameters
    - [ ] if both are: check them and show
        - [ ] success message if verification worked - link to group page from invite
        - [ ] failure message if it failed - button to resend a verification link

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
- Possible cases for the invite page, based on response from getting invite from DB (which is code in api-invites):
    - `"invite ID invalid"` or `"invite not found"` -> display error
    - `"invite not for you"`
        - if user is logged in: invite is for another user -> do not allow acceptance
        - if user is not logged in: invite is for an existing user -> prompt to log in
    - `"invite already accepted"`: invite is already accepted  -> show message
    - `"invite expired"`: invite expired -> show message
    - check if invite is for an email, and if so
        - if user is logged in -> allow acceptance with warning if email address is different
        - if user is not logged in -> allow acceptance (with signup/ login)
    - otherwise invite must be for this logged in user -> allow acceptance
- Acceptance of invite:
    - if user is logged in
        - call accept-invite API
        - show success message with link to group
    - if user is not logged in
        - redirect to signup page, with inviteId in query

- [x] create an invite via live dev site
- [x] get the inviteId from the email
- [x] store the inviteId in cypress env vars
- [x] visit the /invite/[inviteId] page
- [x] display the invite info
    - [x] show group name and description, invitor name, message, valid date
    - [x] show group picture on left side
- [x] reload on logout
- [x] show and test error situations
    - [x] `"invite ID invalid"` or `"invite not found"`
    - [x] `"invite not for you"`
        - [x] if user is logged in: invite is for another user -> do not allow acceptance
        - [x] if user is not logged in: invite is for an existing user -> prompt to log in
    - [x] `"invite already accepted"`: invite is already accepted  -> show message
    - [x] `"invite expired"`: invite expired -> show message
- [x] implement acceptance
    - [x] if user is logged in
    - [x] if user is not logged in
- [x] implement decline
- [ ] tests for accept and decline
    - finish test scripts after
        - sending invitations is possible
        - leaving a group is possible

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
- The custom `<Link>` component catches if the user is not logged in and tries to visit a protected page
    - if so, it displays a toast with an error message

- [ ] redirect directly from `getServerSideProps`

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
- Groups: Regular content = Group list

#### Group card
- [x] shows group image
- [x] shows group name
- [x] shows since-date
- [x] shows # albums + # members
    - [x] only if included in group data
- [x] card is clickable - to group page

### Members page
- [x] get members with API
- [ ] invite button in top row
- [ ] member content in list
    - [x] Avatar
    - [x] Name
    - [x] email (clickable)
    - [x] member since
    - [ ] member options
        - [ ] make guest/ admin
        - [ ] appoint founder
        - [ ] ban from group
- [x] current user has badge
- [x] founder has badge

In original:
- menu is set for the entire list
- when button is clicked on a line, the anchor is passed to that button + member details are passed to anchor state
- the member record contains info on the options that the current user has for that member. Options may include:
    - leave (user can apply to themselves)
    - guestify (of another user)
    - adminify
    - founderify
    - ban
    - uninvite

### Members invite page
- [x] Ensure that backroute still works + current route
- [x] Invite form
    - [x] name, email, text
    - [x] validations
- [ ] check for max members
- [ ] st ate for success or error
- [ ] content for success or error with links
- [ ] api call (useQuery) to invite

### Group page
Tabs are
- [x] albums
    - [ ] remove sort
    - [ ] new album
        - [ ] only if user is admin of the group - need to get membership for this
- [ ] members
- [ ] group profile


### Albums page
- [ ] sort
- [ ] new album
- [ ] album is clickable

### Album page
- [ ] Album header
- [ ] Photos