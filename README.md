#New Frontend for Clubalmanac

Using
- [x] [NextJs](nextjs.org)
- [x] [Material-UI](mui.com) using [example from github](https://github.com/mui/material-ui/tree/master/examples/nextjs)
- [ ] [Cypress](https://docs.cypress.io/guides/overview/why-cypress) for testing frontend e2e
- [ ] [Serverless]() to deploy to AWS
- [ ] [CircleCI]() or [Github Actions]() for CI/CD deployment

### Redirects
Whenever a redirect takes place - e.g. someone not logged in visits a private page - they will be redirected to the login page, and a message appears (as a toast).

This is implemented as follows
- `UserContext` exposes a method `redirectUnAuth(pathname)`
    - this method can be called from the page - should be done in a `useEffect`
    - if the user is not authenticated, a redirect is done with `pathname`, and a (standard) message in a `toast` query
- `_app` has an effect, called whenever path changes, 
    - which checks if there is a toast in the pathname, 
    - and if so, displays the toast