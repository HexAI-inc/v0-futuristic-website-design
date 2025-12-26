# NBSAP Website: Static to Dynamic Web App Conversion Plan

## Overview
Convert the current static Next.js website into a dynamic web application with Supabase-powered content management system (CMS) deployed on Vercel.

## Current State Analysis
- **Static Data**: Content stored in TypeScript files (`icca-data.ts`, `parks-data.ts`)
- **Components**: Hardcoded data rendering
- **Deployment**: Static site generation
- **Content Updates**: Manual code changes required

## Target State
- **Dynamic Data**: Content stored in Supabase PostgreSQL database
- **Components**: Real-time data fetching
- **CMS**: Admin interface for content management
- **Authentication**: Secure admin access
- **Deployment**: Vercel with database integration

---

## Phase 1: Database Design & Setup

### 1.1 Supabase Project Configuration
- [ ] Verify Supabase project is properly configured
- [ ] Set up Row Level Security (RLS) policies
- [ ] Configure authentication providers (if needed)

### 1.2 Database Schema Design

#### Parks Table
```sql
CREATE TABLE parks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  size VARCHAR(100),
  established VARCHAR(50),
  location VARCHAR(255),
  coordinates VARCHAR(100),
  wildlife TEXT[],
  activities TEXT[],
  best_time VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Park Features Table
```sql
CREATE TABLE park_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID REFERENCES parks(id) ON DELETE CASCADE,
  icon VARCHAR(50),
  title VARCHAR(255),
  description TEXT
);
```

#### Park Gallery Table
```sql
CREATE TABLE park_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID REFERENCES parks(id) ON DELETE CASCADE,
  url VARCHAR(500),
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0
);
```

#### ICCAs Table
```sql
CREATE TABLE iccas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  summary TEXT,
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### ICCA Gallery Table
```sql
CREATE TABLE icca_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icca_id UUID REFERENCES iccas(id) ON DELETE CASCADE,
  src VARCHAR(500),
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0
);
```

### 1.3 Supabase Client Setup
- [ ] Install `@supabase/supabase-js`
- [ ] Create `lib/supabase.ts` client configuration
- [ ] Set up environment variables properly

---

## Phase 2: Data Migration

### 2.1 Migration Scripts
- [ ] Create migration scripts to import existing data
- [ ] Handle image uploads to Supabase Storage
- [ ] Validate data integrity during migration

### 2.2 Image Management
- [ ] Set up Supabase Storage buckets for images
- [ ] Upload existing images to storage
- [ ] Update database records with new image URLs

---

## Phase 3: API Routes & Data Fetching

### 3.1 API Routes Creation
Create the following API routes in `app/api/`:

#### Parks API
- `GET /api/parks` - List all parks
- `GET /api/parks/[slug]` - Get specific park
- `POST /api/parks` - Create park (admin only)
- `PUT /api/parks/[id]` - Update park (admin only)
- `DELETE /api/parks/[id]` - Delete park (admin only)

#### ICCAs API
- `GET /api/iccas` - List all ICCAs
- `GET /api/iccas/[id]` - Get specific ICCA
- `POST /api/iccas` - Create ICCA (admin only)
- `PUT /api/iccas/[id]` - Update ICCA (admin only)
- `DELETE /api/iccas/[id]` - Delete ICCA (admin only)

### 3.2 Data Fetching Functions
Create utility functions in `lib/`:
- `getParks()` - Fetch parks data
- `getPark(slug)` - Fetch single park
- `getIccas()` - Fetch ICCAs data
- `getIcca(id)` - Fetch single ICCA

---

## Phase 4: Component Updates

### 4.1 Update Existing Components
Modify components to use dynamic data instead of static imports:

#### Parks Components
- [ ] `app/parks/page.tsx` - Use `getParks()`
- [ ] `app/parks/[slug]/page.tsx` - Use `getPark(slug)`
- [ ] `components/park-*` components - Update props/data sources

#### ICCAs Components
- [ ] `app/iccas/page.tsx` - Use `getIccas()`
- [ ] `components/icca-*` components - Update data sources

### 4.2 Error Handling
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Implement fallback UI for failed data fetches

---

## Phase 5: Admin Interface

### 5.1 Authentication Setup
- [ ] Implement Supabase Auth
- [ ] Create login/logout functionality
- [ ] Set up admin user roles

### 5.2 Admin Dashboard
Create admin pages in `app/admin/`:

#### Parks Management
- `/admin/parks` - List all parks
- `/admin/parks/new` - Create new park
- `/admin/parks/[id]/edit` - Edit existing park

#### ICCAs Management
- `/admin/iccas` - List all ICCAs
- `/admin/iccas/new` - Create new ICCA
- `/admin/iccas/[id]/edit` - Edit existing ICCA

### 5.3 Admin Components
- [ ] Rich text editor for descriptions
- [ ] Image upload components
- [ ] Form validation
- [ ] Drag-and-drop for galleries

---

## Phase 6: Security & Performance

### 6.1 Security Measures
- [ ] Implement Row Level Security (RLS)
- [ ] Set up API route protection
- [ ] Validate user permissions
- [ ] Sanitize user inputs

### 6.2 Performance Optimization
- [ ] Implement caching strategies
- [ ] Add database indexes
- [ ] Optimize image loading
- [ ] Set up CDN for static assets

---

## Phase 7: Testing & Deployment

### 7.1 Testing
- [ ] Unit tests for API routes
- [ ] Integration tests for data fetching
- [ ] E2E tests for admin functionality
- [ ] Performance testing

### 7.2 Deployment
- [ ] Configure Vercel project
- [ ] Set up environment variables on Vercel
- [ ] Configure build settings
- [ ] Set up preview deployments

---

## Phase 8: Migration & Go-Live

### 8.1 Data Migration Execution
- [ ] Run migration scripts
- [ ] Verify data integrity
- [ ] Test all pages with new data

### 8.2 Admin Training
- [ ] Document admin interface usage
- [ ] Create user guides
- [ ] Set up support channels

### 8.3 Monitoring & Maintenance
- [ ] Set up error tracking
- [ ] Configure analytics
- [ ] Plan for regular backups
- [ ] Establish update procedures

---

## Implementation Timeline

### Week 1-2: Foundation
- Database schema design and setup
- Supabase client configuration
- Basic API routes creation

### Week 3-4: Data Layer
- Data migration scripts
- Image management setup
- Complete API routes

### Week 5-6: Frontend Updates
- Update existing components
- Implement loading states
- Add error handling

### Week 7-8: Admin Interface
- Authentication setup
- Admin dashboard creation
- Content management forms

### Week 9-10: Testing & Polish
- Comprehensive testing
- Performance optimization
- Security review

### Week 11-12: Deployment & Launch
- Production deployment
- Admin training
- Go-live monitoring

---

## Dependencies to Install

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @supabase/auth-helpers-react @supabase/auth-ui-react
npm install @supabase/auth-ui-shared
```

## Environment Variables (Already Added)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Database connection strings (for migrations)

## Success Metrics
- [ ] All static data successfully migrated to database
- [ ] Admin interface fully functional
- [ ] All pages load with dynamic data
- [ ] Performance meets or exceeds current static site
- [ ] Secure authentication and authorization
- [ ] Smooth content update workflow

This plan provides a comprehensive roadmap for transforming your static website into a dynamic, content-managed web application.