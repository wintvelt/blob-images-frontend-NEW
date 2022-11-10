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
With react query
- `user.js` (in `data` folder) exposes a queryFn for auth and for user data
    - the `authQueryFn` calls `Auth.currentAuthenticatedUser()`

Amplify `Auth` is called in
- `UserContext`: `.currentAuthenticatedUser()`
- `Protected` Page wrapper: 
    - `.currentAuthenticatedUser()` in SSR function
- `CreateAccountForm`: `.completePassword()` - with email, name, tmp password + def password
- `ForgotPasswordForm`: `.forgotPassword()` - email only (sends mail with code)
- `LoginForm`: `.signIn()`
- `SetPasswordForm`:
    - `.SignIn()`
    - `.forgotPassword()`
    - `.forgotPasswordSubmit()` - email, code, new psw
- `NavBar-UserMenu`: `.signOut()` - also invalidates auth query and removes user query

Specifically for invites, there is some additional setup:
- The invite is retrieved from the client.
    - Result from this request may be different for logged in/out users: An invite for an existing account is only shown to the user logged in on that account
- If the user logs out on the invite page - using button in Nav-UserMenu
    - on logout, if the route contains `/invites/`, then the invite query will be invalidated

### Protected pages
Every protected page needs
- `export ... getServerSideProps` to check server side if the user is authenticated, and to pass any user info to pageProps
    - BTW: should also be included on public pages, because every page displays navbar with user menu
- if the user is not logged in, server will redirect to login page

This is bundled in the `Protected.js` component

Example for Serverside props:
``` js
import { isAuthUser } from '../src/Components/Protected';
import { getSSRRoute } from '../src/utils/route-helper';

export async function getServerSideProps(context) {
    const routeData = getSSRRoute(context)
    const isAuthenticated = await isAuthUser(context)
    return (isAuthenticated) ?
        {
            props: {
                ...routeData
            }
        }
        : { redirect: { destination: '/login' } }
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
    - getServerSideProps passed inviteId to the page/ client
- At creation of an invite, it is addressed to an email. The backend (in api-groups) handles as follows
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

### How nav works
Every page needs a `getServerSideProps`, 
- to retrieve the route from the request, and populate props with `path`, and - if relevant - `groupId`, `albumId`,  `backRoute`
- these are used by the `NavBar` and `NavBar-Left` components, to render the right back links
- The db data with names for Group and Album are retrieved at client side, to prevent unnecessary db calls

`route-helpers` exposes a `getSSRRoute()` function, that can be called as follows
``` js
export async function getServerSideProps(context) {
    const routeData = getSSRRoute(context)
    return {
        props: {
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
If not, the link will not work and a toast will be shown instead.

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
- [ ] `/invites`
    - [ ] create backend function to retrieve open invites
    - [ ] only show invites in tabs if > 0 invites
    - [ ] create invites/index page
    - [ ] check functioning of backroutes/ protected etc
- `/groups`
- `/photos`
- `/profile`
- `/account`

These pages import a `PersonalHeader` component, shown at the top of the page. This component includes
- User info - from `useUser()`
- Tab bar with links to the personal pages

The regular page content is shown below the personal header.
- Groups: Regular content = Group list
- [ ] remove sort button from groups
- [ ] fallback if there are no groups

#### Group card
- [x] shows group image
- [x] shows group name
- [x] shows since-date
- [x] shows # albums + # members
    - [x] only if included in group data
- [x] card is clickable - to group page

### Group page (= Albums Tab)
Tabs are
- [x] albums
    - [ ] new album
        - [ ] only if user is admin of the group - need to get membership for this
- [x] members
- [ ] group profile

### Members page
- [x] get members with API
- [x] invite button in top row
    - [x] only if user may invite
- [x] member content in list
    - [x] Avatar
    - [x] Name
    - [x] email (clickable)
    - [x] member since
    - [x] member options
        - [x] make guest/ admin
        - [x] appoint founder
        - [x] ban from group
- [x] current user has badge
- [x] founder has badge

Setup:
- members index renders following components:
    - GroupHeader, which queries group info
    - MembersMain (in same file) - which
        - queries members and group
        - holds the menu-anchor in state
        - renders menu for the entire list
        - when button is clicked on a line, the anchor is passed to that button + member details are passed to anchor state
- MemberMenu
    - the member record contains info on the options that the current user has for that member Options may include:
        - leave (user can apply to themselves)
        - guestify (of another user)
        - adminify
        - founderify
        - ban
        - uninvite
    - shows confirmation dialog for leave, founderify, ban, uninvite options
    - after confirmation, APIs are called from within this component
    - after succesful calls, queries are invalidated

### Members invite page
- [x] Ensure that backroute still works + current route
- [x] Invite form
    - [x] name, email, text
    - [x] validations
- [x] check for max members
- [x] state for success or error
- [x] content for success or error with links
- [x] api call (useQuery?) to invite

### Album page
- [ ] Album header
- [ ] Photos