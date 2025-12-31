# Next.js App Router Build Safety Guide

## 🚨 CRITICAL RULES FOR BUILD-SAFE API ROUTES

### **MANDATORY EXPORTS (Every Route Must Have)**
```typescript
// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

### **MANDATORY PACKAGE.JSON SCRIPTS FOR VERCEL**
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### **SAFE API ROUTE TEMPLATE**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// MANDATORY: Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Your business logic here
    const result = await prisma.yourModel.findMany()

    // 3. Return response
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 🔧 FIXED LIBRARY FILES

### **lib/prisma.ts** ✅
- Uses singleton pattern
- Safe for build-time evaluation
- No module-level async execution
- Uses default Prisma datasource from schema.prisma

### **lib/auth.ts** ✅
- Converted to function-based approach
- No module-level PrismaAdapter instantiation
- Backward compatible

### **lib/cloudinary.ts** ✅
- No module-level configuration
- Dynamic configuration function
- Safe for build-time evaluation

### **package.json** ✅
- Build script includes `prisma generate`
- `postinstall` script ensures Prisma Client generation
- Vercel-compatible build process

## 🚫 WHAT CAUSES BUILD FAILURES

### **❌ Module-Level Async Execution**
```typescript
// BAD - Runs during build
const result = await prisma.user.findMany()

// GOOD - Runs only in request handlers
export async function GET() {
  const result = await prisma.user.findMany()
}
```

### **❌ Missing Prisma Generation in Build**
```json
// BAD - Vercel will use cached outdated Prisma Client
{
  "scripts": {
    "build": "next build"
  }
}

// GOOD - Always generates fresh Prisma Client
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### **❌ Module-Level Environment Variable Access**
```typescript
// BAD - Evaluated during build
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

// GOOD - Evaluated at runtime
function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
  })
}
```

### **❌ Missing Dynamic Exports**
```typescript
// BAD - May be statically evaluated
export async function GET() { ... }

// GOOD - Forces dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export async function GET() { ... }
```

### **❌ Invalid Next.js Configuration**
```javascript
// BAD - App Router doesn't support 'api' config
const nextConfig = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
}

// GOOD - Clean App Router config
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '10mb' }
  }
}
```

## ✅ BUILD-SAFE PATTERNS

### **1. Authentication Pattern**
```typescript
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... rest of logic
}
```

### **2. Parameter Validation Pattern**
```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params?.id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }
  // ... rest of logic
}
```

### **3. Error Handling Pattern**
```typescript
try {
  // ... business logic
} catch (error) {
  console.error('API Error:', error)
  
  // Handle specific Prisma errors
  if (error instanceof Error && error.message.includes('Record to update not found')) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }
  
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
```

### **4. Cloudinary Usage Pattern**
```typescript
import { configureCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  // Configure only when needed
  const cloudinary = configureCloudinary()
  
  // Use cloudinary...
}
```

## 🔍 VERIFICATION CHECKLIST

Before deploying, ensure every API route has:

- [ ] `export const dynamic = 'force-dynamic'`
- [ ] `export const runtime = 'nodejs'`
- [ ] No module-level async code
- [ ] No module-level environment variable access
- [ ] Proper parameter validation
- [ ] Comprehensive error handling
- [ ] Authentication checks where needed

Before deploying, ensure package.json has:

- [ ] `"build": "prisma generate && next build"`
- [ ] `"postinstall": "prisma generate"`

## 🚀 DEPLOYMENT VERIFICATION

Run these commands before every deployment:

```bash
# 1. Build locally with Prisma generation
npm run build

# 2. Check for any build errors
# 3. Verify all routes show as λ (Dynamic) in build output
# 4. Verify Prisma Client generation in build logs
# 5. Test critical API endpoints
```

## 📋 FUTURE ROUTE CREATION

When creating new API routes, always:

1. Copy from `lib/api-route-template.ts`
2. Add required exports at the top
3. Follow the established patterns
4. Test build locally before pushing

## 🔧 VERCEL-SPECIFIC FIXES

### **Prisma Client Generation**
- Build script includes `prisma generate` before `next build`
- `postinstall` script ensures fresh client after dependency installation
- Explicit datasource configuration in Prisma client

### **Next.js Configuration**
- Removed invalid `api` configuration (Pages Router only)
- Clean App Router configuration
- Proper CORS headers for API routes

This ensures ZERO build failures on Vercel and production environments.