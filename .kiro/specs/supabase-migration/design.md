# Design Document

## Overview

This design outlines the complete migration from Prisma ORM to Supabase for the art gallery e-commerce application. The migration involves replacing all Prisma database operations with Supabase client calls, implementing Supabase Auth for authentication, setting up automated gallery seeding from the public folder, and ensuring all existing functionality remains intact.

The application currently uses Next.js 14 with TypeScript, Prisma ORM, NextAuth for authentication, and Cloudinary for image storage. After migration, it will use Supabase for database operations, authentication, and file storage while maintaining the same user experience.

## Architecture

### Current Architecture
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth with custom providers
- **File Storage**: Cloudinary for image uploads
- **API**: Next.js API routes with Prisma client

### Target Architecture
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS (unchanged)
- **Database**: PostgreSQL via Supabase client
- **Authentication**: Supabase Auth with JWT sessions
- **File Storage**: Supabase Storage for image uploads
- **API**: Next.js API routes with Supabase client

### Migration Strategy
1. **Database Schema Migration**: Convert Prisma schema to Supabase SQL tables
2. **Client Replacement**: Replace all Prisma client calls with Supabase client calls
3. **Authentication Migration**: Replace NextAuth with Supabase Auth
4. **File Storage Migration**: Replace Cloudinary with Supabase Storage
5. **Seeding Implementation**: Create automated gallery seeding from public folder

## Components and Interfaces

### Database Layer
- **Supabase Client**: Primary database interface replacing Prisma client
- **Schema Definitions**: TypeScript interfaces matching Supabase table structures
- **Query Builders**: Utility functions for common database operations
- **Migration Scripts**: SQL scripts to create tables and migrate existing data

### Authentication Layer
- **Supabase Auth**: JWT-based authentication system
- **Session Management**: Server-side session validation and user context
- **Role-Based Access**: Admin and user role enforcement
- **Auth Middleware**: Request authentication and authorization

### File Storage Layer
- **Supabase Storage**: Image upload and management system
- **Image Processing**: Optimization and transformation utilities
- **Gallery Seeding**: Automated image import from public folder
- **Storage Management**: File cleanup and organization

### API Layer
- **Admin Routes**: Gallery, orders, pricing, and settings management
- **User Routes**: Authentication, favorites, and profile management
- **Public Routes**: Gallery browsing and order placement
- **Utility Routes**: Health checks and debugging endpoints

## Data Models

### Core Tables (Supabase)

```sql
-- Users table with authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image TEXT,
  password TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images with metadata
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  style TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing configuration
CREATE TABLE pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style TEXT NOT NULL,
  size TEXT NOT NULL,
  number_of_faces INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(style, size, number_of_faces)
);

-- Offers and promotions
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('FLAT_DISCOUNT', 'PERCENTAGE_DISCOUNT', 'FIRST_ORDER_DISCOUNT')),
  value DECIMAL(10,2) NOT NULL,
  max_discount DECIMAL(10,2),
  coupon_code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  min_order_value DECIMAL(10,2),
  applicable_styles TEXT[] DEFAULT '{}',
  first_order_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders with customer information
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  style TEXT NOT NULL,
  size TEXT NOT NULL,
  number_of_faces INTEGER NOT NULL,
  special_notes TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PREVIEW_SENT', 'REVISION', 'APPROVED', 'COMPLETED')),
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
  offer_id UUID REFERENCES offers(id),
  coupon_code TEXT,
  preview_url TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order images
CREATE TABLE order_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  public_id TEXT NOT NULL
);

-- User favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_id UUID REFERENCES gallery_images(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, image_id)
);

-- Admin settings
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT NOT NULL,
  banner_title TEXT,
  banner_text TEXT,
  banner_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### TypeScript Interfaces

```typescript
interface User {
  id: string
  name?: string
  email: string
  emailVerified?: string
  image?: string
  password?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

interface GalleryImage {
  id: string
  title: string
  description?: string
  imageUrl: string
  publicId: string
  style: string
  tags: string[]
  isActive: boolean
  orderIndex: number
  createdAt: string
  updatedAt: string
}

interface Pricing {
  id: string
  style: string
  size: string
  numberOfFaces: number
  basePrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Order {
  id: string
  orderNumber: string
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  style: string
  size: string
  numberOfFaces: number
  specialNotes?: string
  basePrice: number
  discountAmount: number
  finalPrice: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  offerId?: string
  couponCode?: string
  previewUrl?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, I'll consolidate related properties to eliminate redundancy:

**Property Reflection:**
- Properties 1.2 and 3.1 both test API response compatibility - can be combined
- Properties 3.2, 3.3, 5.2, 5.3 all test CRUD functionality - can be consolidated  
- Properties 4.1, 4.2, 4.3, 4.4, 4.5 all test user-facing functionality - can be grouped
- Properties 6.1, 6.2, 6.3, 6.4 all test error handling - can be combined into comprehensive error handling property

**Property 1: Database Client Migration**
*For any* database operation, the system should use Supabase client calls instead of Prisma client calls and return equivalent data structures
**Validates: Requirements 1.1, 1.2, 3.1**

**Property 2: Authentication System Migration**  
*For any* authentication operation, the system should use Supabase Auth instead of NextAuth while maintaining secure session management
**Validates: Requirements 1.4, 3.4, 5.1, 6.4**

**Property 3: Gallery Seeding Completeness**
*For any* valid image file in the public/artworks directory, the seeding process should create a corresponding database record with proper metadata and make it available in the gallery
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

**Property 4: Duplicate Image Handling**
*For any* set of duplicate images during seeding, the system should skip duplicates and maintain data integrity without creating redundant records
**Validates: Requirements 2.5**

**Property 5: CRUD Operations Preservation**
*For any* create, read, update, or delete operation on gallery items, orders, settings, or user data, the system should maintain the same functionality as before migration
**Validates: Requirements 3.2, 3.3, 5.2, 5.3, 5.4**

**Property 6: File Storage Migration**
*For any* file upload operation, the system should use Supabase Storage instead of Cloudinary and return equivalent URLs and metadata
**Validates: Requirements 3.5**

**Property 7: User Experience Preservation**
*For any* user-facing operation including gallery browsing, favorites management, order placement, and dashboard access, the system should maintain identical functionality and data presentation
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

**Property 8: Analytics and Reporting**
*For any* analytics query or report generation, the system should retrieve accurate data from Supabase and maintain reporting functionality
**Validates: Requirements 5.5**

**Property 9: Error Handling and Resilience**
*For any* error condition including database failures, invalid inputs, network issues, or authentication failures, the system should provide appropriate error messages, graceful degradation, and maintain security
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

## Error Handling

### Database Error Handling
- **Connection Failures**: Implement retry logic with exponential backoff
- **Query Failures**: Provide meaningful error messages and fallback responses
- **Transaction Failures**: Ensure proper rollback and data consistency
- **Timeout Handling**: Set appropriate timeouts and handle gracefully

### Authentication Error Handling
- **Invalid Credentials**: Clear error messages without exposing security details
- **Session Expiry**: Automatic token refresh or redirect to login
- **Permission Denied**: Appropriate HTTP status codes and user feedback
- **Rate Limiting**: Implement and handle rate limit responses

### File Storage Error Handling
- **Upload Failures**: Retry mechanisms and user feedback
- **Storage Quota**: Monitor and handle storage limits
- **File Validation**: Comprehensive file type and size validation
- **Cleanup**: Automatic cleanup of failed uploads

### API Error Handling
- **Validation Errors**: Detailed field-level error messages
- **Server Errors**: Graceful degradation and error logging
- **Network Issues**: Retry logic and offline handling
- **Rate Limiting**: Proper HTTP status codes and retry headers

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit testing and property-based testing to ensure comprehensive coverage:

**Unit Testing:**
- Specific examples demonstrating correct behavior
- Integration points between components  
- Edge cases and error conditions
- Authentication flows and session management
- File upload and storage operations

**Property-Based Testing:**
- Universal properties that should hold across all inputs
- Database operation consistency
- API response format preservation
- Authentication security properties
- Data integrity during migration
- Error handling behavior across different failure modes

**Property-Based Testing Framework:**
We will use **fast-check** for TypeScript/JavaScript property-based testing. Each property-based test will run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging Requirements:**
- Each property-based test must include a comment with the format: `**Feature: supabase-migration, Property {number}: {property_text}**`
- Each test must explicitly reference the correctness property from this design document
- Unit tests should reference specific requirements they validate

### Migration Testing Strategy

**Pre-Migration Testing:**
- Comprehensive test suite for existing Prisma implementation
- API response format documentation and validation
- Performance baseline establishment
- Data integrity verification

**Migration Testing:**
- Side-by-side comparison of Prisma vs Supabase responses
- Data migration validation and integrity checks
- Authentication flow testing with both systems
- Performance comparison and optimization

**Post-Migration Testing:**
- Full regression testing of all functionality
- Load testing with Supabase backend
- Security testing of new authentication system
- End-to-end user journey validation

### Test Data Management

**Gallery Seeding Tests:**
- Create test image sets in public/artworks directory
- Verify seeding process with various image formats
- Test duplicate detection and handling
- Validate metadata generation accuracy

**Database Migration Tests:**
- Test data migration scripts with sample data
- Verify foreign key relationships and constraints
- Test rollback procedures and data recovery
- Validate data type conversions and formatting

## Implementation Phases

### Phase 1: Database Schema and Client Setup
- Create Supabase tables matching Prisma schema
- Set up Supabase client configuration
- Implement basic CRUD operations
- Create migration utilities

### Phase 2: Authentication Migration
- Replace NextAuth with Supabase Auth
- Update session management
- Migrate user authentication flows
- Update middleware and route protection

### Phase 3: API Route Migration
- Replace Prisma calls in all API routes
- Update response formatting for compatibility
- Implement error handling improvements
- Add comprehensive logging

### Phase 4: File Storage Migration
- Replace Cloudinary with Supabase Storage
- Update image upload workflows
- Implement gallery seeding from public folder
- Update image optimization and serving

### Phase 5: Frontend Integration
- Update client-side authentication
- Test all user workflows
- Update admin panel functionality
- Implement real-time features where beneficial

### Phase 6: Testing and Optimization
- Comprehensive testing of all functionality
- Performance optimization and monitoring
- Security audit and hardening
- Documentation and deployment preparation