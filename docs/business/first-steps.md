# FridgeAI Implementation Plan

## Project Overview
Transform the agentic coding boilerplate into **FridgeAI** - a web application that uses AI to generate recipes from fridge photos, with comprehensive recipe details and user management.

## Phase 1: Database Schema & Backend Setup

### Database Schema Design
**Remove existing todo schema and create:**

```sql
-- Recipes table
recipes:
  - id (serial, primary key)
  - userId (text, foreign key to user.id)
  - title (text, not null)
  - description (text)
  - ingredients (jsonb) -- structured ingredient data with portions
  - instructions (text[]) -- step-by-step array
  - nutritionalInfo (jsonb) -- calories, protein, carbs, etc.
  - cookingTime (text) -- user-specified time
  - difficulty (text) -- AI-generated difficulty level
  - cuisine (text) -- user-specified cuisine
  - originalImageUrl (text) -- uploaded fridge photo
  - finishedDishImageUrl (text) -- AI-generated dish photo
  - createdAt (timestamp)
  - updatedAt (timestamp)

-- Recipe sharing (for shareable links)
recipe_shares:
  - id (text, primary key) -- UUID for public links
  - recipeId (int, foreign key to recipes.id)
  - createdAt (timestamp)
  - expiresAt (timestamp, nullable)
```

### API Endpoints
- `POST /api/recipes` - Create new recipe from image
- `GET /api/recipes` - Get user's recipes with filtering
- `GET /api/recipes/[id]` - Get specific recipe
- `DELETE /api/recipes/[id]` - Delete recipe
- `POST /api/recipes/[id]/share` - Generate shareable link
- `GET /api/shared/[shareId]` - View shared recipe

## Phase 2: AI Integration & Image Processing

### OpenAI Integration
1. **Vision API for Ingredient Recognition**
   - Process uploaded fridge images
   - Extract ingredients list with confidence scores
   - Return structured ingredient data

2. **Recipe Generation with GPT-4**
   - Use identified ingredients + user preferences (cuisine, time)
   - Generate comprehensive recipes with:
     - Ingredient portions
     - Step-by-step instructions
     - Nutritional information
     - Difficulty assessment
     - Cooking time estimate

3. **Image Generation for Finished Dishes**
   - Use DALL-E to create appetizing dish photos
   - Generate based on recipe title and key ingredients
   - Store generated images using Vercel Blob

### Image Storage Strategy
- Use existing `BLOB_READ_WRITE_TOKEN` for Vercel Blob storage
- Store original fridge photos and generated dish images
- Implement image optimization and compression

## Phase 3: Complete UI Overhaul

### Remove All Boilerplate Components
**Delete/Replace:**
- `components/setup-checklist.tsx`
- `components/starter-prompt-modal.tsx`
- All boilerplate content in pages
- Existing navigation structure

### New Component Architecture

#### Core Components:
```
components/
├── recipe/
│   ├── recipe-upload-form.tsx    # Image upload + preferences
│   ├── recipe-card.tsx           # Recipe display card
│   ├── recipe-detail.tsx         # Full recipe view
│   ├── recipe-list.tsx           # Dashboard recipe grid
│   └── recipe-filters.tsx        # Filter controls
├── ui/ (keep existing shadcn/ui)
├── navigation/
│   ├── main-nav.tsx              # New navigation
│   └── user-menu.tsx             # User profile dropdown
└── shared/
    ├── image-upload.tsx          # Reusable image upload
    ├── loading-spinner.tsx       # Recipe generation loading
    └── share-dialog.tsx          # Recipe sharing modal
```

### Page Structure:
```
app/
├── page.tsx                      # Landing page (replace completely)
├── recipes/                      # Main dashboard (replace /dashboard)
│   ├── page.tsx                  # My Recipes page
│   ├── [id]/
│   │   └── page.tsx              # Recipe detail view
│   └── shared/
│       └── [shareId]/
│           └── page.tsx          # Public shared recipe view
├── profile/                      # User settings (replace current)
│   └── page.tsx
└── api/
    ├── recipes/
    │   ├── route.ts              # CRUD operations
    │   └── [id]/
    │       ├── route.ts
    │       └── share/
    │           └── route.ts
    └── upload/
        └── route.ts              # Image upload handler
```

## Phase 4: User Experience & Features

### Landing Page (/)
- Hero section explaining FridgeAI
- Feature highlights with food/cooking imagery
- Clear call-to-action to sign up/login
- Maybe include demo recipe examples

### My Recipes Page (/recipes)
**Top Section - "Add New Recipe":**
- Prominent image upload area with drag-and-drop
- Cuisine preference field (free text with placeholders: "Italian, Asian, Mexican, comfort food...")
- Cooking time field (free text with placeholders: "30 minutes", "quick meal", "under 1 hour")
- Generate Recipe button

**Bottom Section - "My Past Recipes":**
- Grid/card layout of recipe cards
- Each card shows: thumbnail, title, cuisine, time, difficulty
- Filter controls: cuisine, cooking time, difficulty, date created
- Search functionality
- Sorting options (newest, oldest, cooking time, difficulty)

### Recipe Detail View
- Large finished dish image
- Original fridge photo (smaller, expandable)
- Complete ingredient list with portions
- Step-by-step instructions
- Nutritional information panel
- Recipe metadata (difficulty, time, cuisine)
- Share button with options (link, email, PDF)

### Profile Page
- User information management
- Account settings
- Maybe recipe statistics (total recipes, favorite cuisines, etc.)

## Phase 5: Enhanced Features

### Sharing System
1. **Copy Link**: Generate UUID-based shareable URLs
2. **Email Sharing**: Simple form to send recipe via email
3. **PDF Export**: Generate printable PDF with recipe details

### Progressive Enhancements
- Recipe favoriting system
- Recipe rating/notes
- Ingredient shopping list generation
- Recipe modification/editing
- Social features (if desired later)

## Technical Implementation Notes

### Form Handling
- Use React Hook Form for upload form
- Add proper validation for image uploads
- Implement optimistic updates for better UX

### Loading States
- Show skeleton components while AI processes images
- Progress indicators for recipe generation
- Smooth transitions between states

### Error Handling
- Handle cases where AI can't identify ingredients
- Network error recovery
- Image upload failures
- Graceful degradation

### Performance Optimizations
- Image compression before upload
- Lazy loading for recipe grids
- Caching for frequently accessed recipes
- Optimized database queries with proper indexing

## Success Criteria
- ✅ Complete removal of all boilerplate UI and content
- ✅ Working fridge-to-recipe pipeline with AI
- ✅ User authentication and recipe ownership
- ✅ Filterable recipe dashboard
- ✅ Recipe sharing functionality
- ✅ Responsive design for mobile photo uploads
- ✅ Professional food/cooking app aesthetic
- ✅ Comprehensive recipe details as specified

## Next Steps
1. Update database schema and run migrations
2. Set up image upload and storage
3. Integrate OpenAI Vision and GPT APIs
4. Build core recipe components
5. Replace all pages with FridgeAI functionality
6. Implement sharing system
7. Polish UI/UX and add loading states
8. Test thoroughly and deploy