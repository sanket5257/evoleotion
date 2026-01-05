# Supabase Client Utilities Documentation

This document describes the Supabase client utilities that replace Prisma ORM in the application.

## Files Overview

### Core Files
- `lib/prisma.ts` - Main Supabase client configuration (replaces Prisma client)
- `lib/supabase-db.ts` - Database utilities and repository pattern implementation
- `lib/supabase.ts` - Client-side Supabase client and file storage utilities
- `types/supabase.ts` - TypeScript type definitions for database schema

### Test Files
- `lib/supabase-test.ts` - Test utilities for verifying Supabase functionality
- `app/api/test-supabase-utilities/route.ts` - API endpoint for testing utilities

## Key Features

### 1. Repository Pattern
The `SupabaseRepository` class provides generic CRUD operations:

```typescript
// Usage example
import { usersRepository } from '@/lib/supabase-db'

// Create a user
const user = await usersRepository.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'USER'
})

// Find users
const users = await usersRepository.findMany({
  where: { role: 'USER' },
  orderBy: { column: 'createdAt', ascending: false },
  limit: 10
})

// Update user
const updatedUser = await usersRepository.update(user.id, {
  name: 'John Smith'
})
```

### 2. Specialized Database Operations
Pre-built functions for common operations:

```typescript
import { 
  getUserByEmail,
  getActiveGalleryImages,
  getActivePricing,
  generateOrderNumber
} from '@/lib/supabase-db'

// Get user by email
const user = await getUserByEmail('user@example.com')

// Get active gallery images
const images = await getActiveGalleryImages({
  style: 'portrait',
  limit: 20
})
```

### 3. Error Handling
Comprehensive error handling with retry mechanism:

```typescript
import { DatabaseError, withRetry } from '@/lib/supabase-db'

try {
  const result = await someOperation()
} catch (error) {
  if (error instanceof DatabaseError) {
    console.error('Database operation failed:', error.message)
    console.error('Original error:', error.originalError)
  }
}
```

### 4. Connection Management
Built-in connection health checks and retry logic:

```typescript
import { checkDatabaseConnection } from '@/lib/supabase-db'

const isHealthy = await checkDatabaseConnection()
```

### 5. File Storage
Supabase Storage integration for image uploads:

```typescript
import { uploadToSupabase, deleteFromSupabase } from '@/lib/supabase'

// Upload file
const result = await uploadToSupabase(file, 'gallery')
console.log('Uploaded to:', result.secure_url)

// Delete file
await deleteFromSupabase(result.public_id)
```

## Repository Instances

Pre-configured repository instances for all tables:

- `usersRepository` - User management
- `galleryImagesRepository` - Gallery image management
- `pricingRepository` - Pricing configuration
- `offersRepository` - Offers and promotions
- `ordersRepository` - Order management
- `orderImagesRepository` - Order image attachments
- `userFavoritesRepository` - User favorites
- `adminSettingsRepository` - Admin settings

## Migration from Prisma

### Before (Prisma)
```typescript
import { prisma } from '@/lib/prisma'

const users = await prisma.user.findMany({
  where: { role: 'USER' },
  orderBy: { createdAt: 'desc' }
})
```

### After (Supabase)
```typescript
import { usersRepository } from '@/lib/supabase-db'

const users = await usersRepository.findMany({
  where: { role: 'USER' },
  orderBy: { column: 'createdAt', ascending: false }
})
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Testing

Test the utilities using the test endpoint:
```
GET /api/test-supabase-utilities
```

Or programmatically:
```typescript
import { testSupabaseConnection } from '@/lib/supabase-test'

const result = await testSupabaseConnection()
console.log(result)
```

## Performance Features

- **Retry Logic**: Automatic retry with exponential backoff for failed operations
- **Connection Pooling**: Managed by Supabase infrastructure
- **Batch Operations**: Support for batch inserts with configurable batch size
- **Query Optimization**: Built-in query optimization and caching

## Security Features

- **Row Level Security**: Configured at database level
- **Type Safety**: Full TypeScript support with generated types
- **Input Validation**: Built-in validation for all operations
- **Error Sanitization**: Secure error messages without exposing sensitive data

## Next Steps

1. Update API routes to use new Supabase utilities (Task 4 & 5)
2. Migrate authentication system (Task 3)
3. Update frontend components (Task 8)
4. Remove Prisma dependencies (Task 11)