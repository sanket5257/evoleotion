# Gallery Seeding Documentation

This document describes the automated gallery seeding functionality that populates the database with artwork images from the `public/artworks` directory.

## Overview

The gallery seeding system automatically scans the `public/artworks` directory for image files and creates corresponding database records with appropriate metadata. It includes duplicate detection, error handling, and multiple execution strategies.

## Features

- **Automatic Image Discovery**: Scans `public/artworks` directory for supported image formats
- **Metadata Extraction**: Generates titles, descriptions, and tags from filenames
- **Style Detection**: Automatically detects art style based on filename patterns
- **Duplicate Detection**: Prevents duplicate entries using multiple criteria
- **Flexible Strategies**: Skip, update, or create new records for duplicates
- **Dry Run Mode**: Preview what would be seeded without making changes
- **API Integration**: RESTful API for automated deployment seeding
- **Error Handling**: Comprehensive error reporting and graceful degradation

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- BMP (.bmp)
- TIFF (.tiff)

## Style Detection

The system automatically detects art styles based on filename patterns:

| Style | Filename Patterns |
|-------|------------------|
| Charcoal | charcoal, coal |
| Pencil Sketch | pencil, sketch |
| Watercolor | watercolor, water |
| Oil | oil |
| Acrylic | acrylic |

If no pattern matches, defaults to "Charcoal".

## Usage

### Command Line Interface

#### Basic Seeding
```bash
npm run seed:gallery
```

#### Dry Run (Preview Only)
```bash
npm run seed:gallery:dry
```

#### Force Create New Records
```bash
npm run seed:gallery:force
```

#### Update Existing Records
```bash
npm run seed:gallery:update
```

### API Endpoints

#### Preview Seeding (GET)
```http
GET /api/admin/gallery/seed
```

Returns a preview of what would be seeded without making changes.

#### Execute Seeding (POST)
```http
POST /api/admin/gallery/seed
Content-Type: application/json

{
  "skipExisting": true,
  "dryRun": false,
  "duplicateStrategy": "skip"
}
```

**Parameters:**
- `skipExisting` (boolean): Skip processing if duplicates found
- `dryRun` (boolean): Preview mode without database changes
- `duplicateStrategy` (string): "skip", "update", or "create_new"

### Programmatic Usage

```typescript
import { seedGalleryFromPublic } from '@/scripts/seed-gallery-from-public'
import { DuplicateStrategy } from '@/lib/gallery-seeding-utils'

const results = await seedGalleryFromPublic({
  skipExisting: true,
  dryRun: false,
  duplicateStrategy: DuplicateStrategy.SKIP
})

console.log(`Created: ${results.created}, Skipped: ${results.skipped}`)
```

## Duplicate Detection

The system uses multiple criteria to detect duplicates:

1. **Image URL**: Matches the relative path to the image
2. **Public ID**: Matches the unique identifier
3. **Filename**: Matches the actual filename

### Duplicate Strategies

#### Skip (Default)
- Skips processing if a duplicate is found
- Maintains existing records unchanged
- Fastest option for repeated runs

#### Update
- Updates existing records with new metadata
- Preserves the original ID and creation date
- Useful for refreshing metadata

#### Create New
- Creates a new record with a unique ID
- Allows multiple records for the same image
- Useful for testing or versioning

## Metadata Generation

### Title Generation
- Converts filename to human-readable title
- Removes file extensions and special characters
- Capitalizes words appropriately
- Falls back to style-based naming if needed

### Description Generation
- Creates descriptive text based on detected style
- Includes artistic technique references
- Maintains consistent formatting

### Tag Generation
- Includes basic tags: "portrait", "artistic", "handcrafted"
- Adds style-specific tags
- Uses underscore format for multi-word styles

## Error Handling

The system includes comprehensive error handling:

- **File System Errors**: Missing directories, permission issues
- **Database Errors**: Connection failures, constraint violations
- **Validation Errors**: Invalid file formats, corrupted images
- **Network Errors**: API timeouts, connection issues

All errors are logged with detailed context and don't stop the entire process.

## Configuration

### Environment Variables
Ensure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Directory Structure
```
public/
└── artworks/
    ├── charcoal-portrait-1.jpg
    ├── pencil-sketch-family.png
    └── watercolor-landscape.webp
```

## Deployment Integration

### Vercel Build Hook
Add to your `vercel.json`:

```json
{
  "functions": {
    "app/api/admin/gallery/seed/route.ts": {
      "maxDuration": 300
    }
  }
}
```

### Build Script Integration
Add to your deployment pipeline:

```bash
# After deployment
curl -X POST https://your-domain.com/api/admin/gallery/seed \
  -H "Content-Type: application/json" \
  -d '{"skipExisting": true, "dryRun": false}'
```

## Monitoring and Logging

The system provides detailed logging:

- **Progress Tracking**: Shows current file being processed
- **Statistics**: Counts of created, updated, and skipped records
- **Error Details**: Specific error messages with context
- **Performance Metrics**: Processing time and success rates

## Best Practices

1. **Test First**: Always run with `--dry-run` before actual seeding
2. **Backup Database**: Create backups before large seeding operations
3. **Monitor Logs**: Check logs for errors and performance issues
4. **Organize Files**: Use descriptive filenames for better metadata
5. **Regular Cleanup**: Remove unused images from the artworks directory

## Troubleshooting

### Common Issues

#### "Directory not found"
- Ensure `public/artworks` directory exists
- Check file permissions

#### "Database connection failed"
- Verify Supabase credentials
- Check network connectivity

#### "Duplicate key violation"
- Use `skipExisting: true` option
- Check for existing records manually

#### "File format not supported"
- Verify image file extensions
- Check file corruption

### Debug Mode
Enable detailed logging by setting:
```bash
DEBUG=gallery-seeding npm run seed:gallery
```

## Performance Considerations

- **Batch Processing**: Processes files in batches to avoid memory issues
- **Connection Pooling**: Reuses database connections efficiently
- **Error Recovery**: Continues processing after individual file errors
- **Memory Management**: Streams large files instead of loading entirely

## Security

- **Input Validation**: Validates all file types and sizes
- **Path Sanitization**: Prevents directory traversal attacks
- **Access Control**: Requires admin authentication for API endpoints
- **Error Sanitization**: Doesn't expose sensitive information in errors