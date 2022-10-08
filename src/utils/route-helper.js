// used to show icon in center of navbar when we are on child route
export const isChildRoute = (pathname = '/') => {
    return pathname.includes('/groups/')
        || pathname.includes('/albums/')
}

// takes out last section of route
const upOneRoute = (path) => path.split('/').slice(0,-1).join('/');

export const previousRoute = (pathname = '/') => {
    if (pathname.includes('/albums/')) return upOneRoute(pathname)
    if (pathname.includes('/groups/')) return upOneRoute(pathname)
}

// used to identify protected route
// for intercepting links
// for redirecting to home on logout
export const isProtectedRoute = (pathname = '/') => {
    return pathname.includes('/groups/')
        || pathname.includes('/albums/')
        || pathname.includes('/about')
}

export const groupIdFromRoute = (pathname = '/') => {
    const pathSegments = pathname.split('/')
    const a = 2
}