export const isChildRoute = (pathname = '/') => {
    return pathname.includes('/groups/')
    || pathname.includes('/albums/')
    || pathname.includes('/about')
}