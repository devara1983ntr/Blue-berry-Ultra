h# Blueberry Video Streaming Platform

## Overview

Blueberry is a premium adult video streaming platform built with modern web technologies. The application features a sophisticated, content-first interface with glassmorphic design elements, drawing inspiration from premium streaming services. It provides video browsing, categorization, search functionality, and an elegant player experience.

The platform is architected as a full-stack TypeScript application with a React frontend and Express backend, designed for deployment on Replit with PostgreSQL database support.

## Recent Changes

- **Paginated Video Loading**: Videos now load page-wise from 1260 JSON files (data/videos_page_1.json to data/videos_page_1260.json), providing access to 126,000+ videos
- **Age Verification**: Mandatory 18+ age verification modal with "I am 18+" confirmation button
- **Guest User Limits**: Guest users limited to 3000 videos; logged-in users get unlimited access
- **Multi-Language Support**: Full i18n support for English, Hindi, Odia, Tamil, and Telugu
- **Developer Credits**: About page credits Roshan Sahu, Papun Sahu, and Rohan Sahu
- **Auto-derived Categories**: 50+ categories extracted dynamically from video JSON data
- **Context Providers**: LanguageContext, AgeVerificationContext, CookieConsentContext, AuthContext, GuestLimitContext

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (replacing React Router for smaller bundle size)
- TanStack Query (React Query) for server state management and caching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Framer Motion for smooth animations and transitions
- Custom glassmorphic design system defined in CSS variables

**Design Philosophy**
- Dark mode only with premium aesthetic (Netflix-inspired elegance)
- Glassmorphic depth with backdrop blur effects
- Typography hierarchy using Inter (body) and Poppins (headings) from Google Fonts
- Responsive grid system: 1 column (mobile) → 2 columns (tablet) → 4-5 columns (desktop)
- Content-forward layout prioritizing video thumbnails and browsing experience

**State Management Strategy**
- Server state handled by TanStack Query with query invalidation
- Local UI state managed with React hooks (useState, useMemo)
- Context providers for: Language, Age Verification, Cookie Consent, Auth, Guest Limit, Favorites
- Search and filtering performed client-side after data fetch for instant responsiveness

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the HTTP server
- Custom logging middleware tracking request duration and response status
- Static file serving for production builds via express.static
- Development mode integration with Vite middleware for HMR

**API Design**
- RESTful endpoints following convention:
  - `GET /api/videos?page=N` - List videos for page N (from videos_page_N.json)
  - `GET /api/videos?search=query` - Search videos across pages
  - `GET /api/videos?category=cat` - Filter by category
  - `GET /api/videos/:id` - Fetch individual video (id format: "pageNum-index")
  - `GET /api/categories` - Retrieve all categories (auto-extracted from JSON data)
  - `GET /api/performers` - Retrieve all performers/actors
  - `GET /api/tags` - Retrieve all tags
  - `GET /api/stats` - Get total pages and video counts
- Query parameter based filtering (search, category, performer, tag)
- JSON response format with consistent error handling

**Data Layer**
- VideoStorage class loads videos dynamically from 1260 JSON files
- Each JSON file contains ~100 videos with embedded video data
- Auto-extracts categories, performers, and tags from video metadata
- Pagination support with hasNext/hasPrevious indicators

**Database Schema Design** (Prepared for PostgreSQL)
- Drizzle ORM configured for type-safe database operations
- Schema defined in `shared/schema.ts` with Zod validation
- Video schema includes: id, title, thumbnailUrl, embedCode, embedUrl, duration, views, likes, dislikes, categories, tags, actors, screenshots
- Migration support via drizzle-kit

### Video Data Structure

Each video from JSON includes:
- `embed`: HTML iframe embed code
- `thumbnail` / `thumbnail2`: Thumbnail image URLs
- `screenshots`: Array of screenshot image URLs
- `title`: Video title
- `tags`: Semicolon-separated tag list
- `categories`: Semicolon-separated category list
- `actors`: Semicolon-separated performer list
- `duration`: Duration in seconds
- `views`: View count
- `likes` / `dislikes`: Rating counts

### Build & Deployment Strategy

**Development Workflow**
- `npm run dev` - Runs Express server with Vite middleware in development mode
- Vite dev server provides instant HMR with source map support
- Custom runtime error overlay for development debugging

**Production Build Process**
- `npm run build` - Custom build script (`script/build.ts`) performs:
  1. Client build via Vite (outputs to `dist/public`)
  2. Server build via esbuild (outputs to `dist/index.cjs`)
  3. Selective dependency bundling (allowlist for faster cold starts)
  4. External dependencies (not bundled) for reduced bundle size

**Deployment Configuration**
- Node.js production server via `npm start`
- Environment-based configuration (DATABASE_URL from environment variables)
- Static assets served from `dist/public` with fallback to index.html for SPA routing

### Code Organization

**Monorepo Structure**
- `client/` - React frontend application
  - `src/pages/` - Route components (Home, VideoPlayer, Login, Register, About, Privacy, Terms, Contact, Settings, History, WatchLater, Notifications, Welcome, Offline)
  - `src/components/` - Reusable UI components
  - `src/components/ui/` - Shadcn UI component library
  - `src/context/` - Context providers (Language, AgeVerification, CookieConsent, Auth, GuestLimit, Favorites)
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utilities (queryClient, utils)
  - `src/lib/i18n/` - Translation files for 5 languages
- `server/` - Express backend
  - `routes.ts` - API endpoint definitions
  - `storage.ts` - VideoStorage class for JSON file loading
  - `vite.ts` - Vite development middleware
  - `static.ts` - Static file serving
- `shared/` - Code shared between frontend and backend
  - `schema.ts` - Type definitions and Zod schemas
- `data/` - 1260 JSON files containing video data

**Path Aliases**
- `@/` → `client/src/` (frontend imports)
- `@shared/` → `shared/` (shared types)
- `@assets/` → `attached_assets/` (static assets)

## External Dependencies

### Core Technologies
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL driver for database connectivity
- **Drizzle ORM** (drizzle-orm) - Type-safe SQL query builder and ORM
- **Express.js** - Web server framework with middleware ecosystem

### Frontend Libraries
- **React** (implicit via Vite) - UI library
- **Wouter** - Lightweight routing (~1.2KB)
- **TanStack Query** (@tanstack/react-query) - Server state management
- **Radix UI** - Accessible component primitives (20+ components)
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Class Variance Authority** - Component variant management
- **Zod** - Schema validation (shared between frontend/backend)

### Development Tools
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety across the stack
- **ESBuild** - Fast JavaScript bundler for server builds
- **PostCSS** - CSS processing with Tailwind and Autoprefixer

### UI Component Dependencies
- Multiple @radix-ui packages for accessible primitives (accordion, dialog, dropdown, etc.)
- Lucide React for icon components
- Embla Carousel for carousels (if needed)
- CMDK for command palette components

### Planned Integrations
- Session management infrastructure (connect-pg-simple, express-session)
- Authentication scaffolding (passport, passport-local)
- Advanced playback features (10+ enhancements)
- Gesture-based interactions (10+ gestures)

### Environment Requirements
- Node.js environment with ES modules support
- PostgreSQL database (via DATABASE_URL environment variable)
- Replit-specific plugins for development (@replit/vite-plugin-*)
