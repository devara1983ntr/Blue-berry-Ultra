# Blueberry Video Streaming Platform - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium streaming platforms (Netflix dark elegance + Pornhub's content-first layout + modern glassmorphism)

**Core Aesthetic**: Premium adult entertainment platform with sophisticated, professional UI that elevates the streaming experience through glassmorphic depth, subtle animations, and content-forward design.

---

## Typography System

**Primary Font**: Inter (Google Fonts) - Modern, highly legible
**Secondary Font**: Poppins (Google Fonts) - Headlines and accents

**Hierarchy**:
- Hero/Logo: Poppins Bold, 32px (mobile) / 48px (desktop)
- Section Headers: Poppins SemiBold, 24px (mobile) / 32px (desktop)
- Video Titles: Inter Medium, 16px (mobile) / 18px (desktop)
- Body Text: Inter Regular, 14px (mobile) / 16px (desktop)
- Metadata (views, duration): Inter Regular, 12px / 14px
- Navigation Links: Inter Medium, 15px

---

## Layout & Spacing System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., p-4, gap-6, mb-8)

**Grid System**:
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 4 columns (lg:grid-cols-4)
- Large Desktop: 5 columns (xl:grid-cols-5)

**Container Strategy**:
- Max-width: 1920px (full layout)
- Content padding: px-4 (mobile), px-8 (tablet), px-12 (desktop)
- Section spacing: py-8 (mobile), py-12 (desktop)

---

## Navigation & Layout Structure

### Header (Fixed)
- Height: 64px on all devices
- Top-right hamburger menu (☰) - 44x44px touch target
- Left: Blueberry logo (Poppins Bold) with subtle gradient
- Center: Search bar with glassmorphic background (hidden on mobile, shows on md+)
- Sticky positioning with backdrop blur

### Side Navigation Drawer
- Width: 280px (slides from right)
- Glassmorphic background with heavy blur
- Overlay darkens main content (40% opacity)
- Categories list with icons (Heroicons)
- User profile section at top
- Developer credits at bottom
- Smooth slide-in animation (300ms ease-out)

### Back Button
- Fixed position: top-left, 44x44px
- Shows on video player page and category pages
- Glassmorphic circular button with arrow icon
- Positioned 16px from edges

---

## Component Library

### Video Card (Thumbnail)
- Aspect ratio: 16:9 (enforced)
- Rounded corners: 12px
- Thumbnail image with gradient overlay (bottom fade)
- Duration badge: bottom-right, glassmorphic pill
- Hover: Scale 1.03, lift shadow (200ms ease)
- Below thumbnail: Title (2 lines max, ellipsis), metadata row (views, upload date)

### Category Pills
- Horizontal scrollable row
- Glassmorphic background, 32px height
- Active state: Solid fill, inactive: Bordered ghost style
- Smooth scroll with momentum

### Search Bar
- Glassmorphic container, 48px height
- Search icon left, clear icon right (when text present)
- Rounded: 24px (pill shape)
- Focus: Subtle glow effect

### Video Player Container
- Full-width aspect ratio container (16:9)
- Embedded iframe with rounded corners (16px on desktop, 0px on mobile)
- Below player: Title, view count, upload date, description section

### Glassmorphic Buttons
- Primary: Gradient background, white text
- Secondary: Glassmorphic with border
- On images/hero: Heavy backdrop blur, semi-transparent white background
- Height: 44px, Rounded: 22px
- No custom hover states (browser default handles)

---

## Page Structures

### Homepage
1. **Hero Section** (40vh mobile / 50vh desktop)
   - Featured video background (auto-playing, muted, looped video or static image)
   - Gradient overlay (dark bottom to transparent)
   - Centered: Platform tagline + Primary CTA button with blurred background
   
2. **Category Pills Row** (sticky below header)
   - Trending, New, Top Rated, Categories...
   
3. **Video Grid Sections**
   - Section header: "Trending Now", "Recently Added", "Top Rated"
   - 4-5 video cards per row (desktop)
   - Infinite scroll or pagination

### Video Player Page
1. Back button (top-left)
2. Embedded video player (Pornhub iframe)
3. Video metadata section
4. Related videos grid below (2 columns mobile, 4 desktop)

### Category Page
- Back button (top-left)
- Category header with count
- Filtered video grid
- Load more functionality

---

## Glassmorphic Design System

**Glass Card Properties**:
- Background: rgba(255, 255, 255, 0.05)
- Backdrop blur: 12px - 20px
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Shadow: Subtle depth (0 8px 32px rgba(0, 0, 0, 0.15))

**Applied To**: Navigation drawer, search bar, buttons, category pills, video duration badges, metadata containers

---

## Animations & Interactions

**Minimal Animation Philosophy**: Smooth but subtle

**Implemented Animations**:
- Navigation drawer: Slide-in/out (300ms)
- Video card hover: Scale + shadow (200ms)
- Category pill transitions: Background change (150ms)
- Page transitions: Fade (200ms)
- Scroll reveals: Subtle fade-up for video cards (stagger 50ms)

**Avoid**: Excessive parallax, distracting auto-play animations, heavy particles

---

## Footer

- Glassmorphic container
- Three columns (desktop) / stacked (mobile)
- Column 1: Logo + tagline
- Column 2: Quick links (Categories, About, Contact)
- Column 3: Developer credits section
  - "Developed by Roshan Sahu, Papun Sahu, Rohan Sahu"
  - Small text, centered styling
- Bottom: Copyright year

---

## Images Section

**Hero Background**: Use a stylized, abstract gradient or subtle pattern background (NOT explicit content). Alternative: Dark gradient with floating geometric shapes for premium feel.

**Video Thumbnails**: Embedded from Pornhub - maintain 16:9 aspect ratio with object-fit cover.

**Placeholder States**: Use gradient placeholders while thumbnails load.

---

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+
- Large Desktop: 1440px+