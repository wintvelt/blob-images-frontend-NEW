// used to show icon in center of navbar when we are on child route
export const isChildRoute = (pathname = '/') => {
    return pathname.includes('/groups/')
        || pathname.includes('/albums/')
        || pathname.includes('/about')
}

// used to identify protected route
// for intercepting links
// for redirecting to home on logout
export const isProtectedRoute = (pathname = '/') => {
    return pathname.includes('/groups/')
        || pathname.includes('/albums/')
        || pathname.includes('/about')
}