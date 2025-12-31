// This file is needed to handle the dynamic route in Vercel
export const dynamic = 'force-dynamic'
export const revalidate = 0

export { GET, PUT, PATCH, DELETE } from './route.handler'
