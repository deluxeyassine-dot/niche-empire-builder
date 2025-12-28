# Dashboard Preview - Visual Guide

This document describes the visual design and layout of each step in the Empire Creator dashboard.

## Color Scheme

- **Primary**: Blue (#2563eb)
- **Secondary**: Dark Blue (#1e40af)
- **Accent**: Amber (#f59e0b)
- **Success**: Green (#10b981)
- **Background**: Light Gray (#f3f4f6)

## Typography

- **Font Family**: System fonts (Apple/Segoe UI/Roboto)
- **Headers**: Bold, 700 weight
- **Body**: Regular, 400 weight
- **Emphasis**: Semi-bold, 600 weight

---

## Step 1: Template Selection

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                 Create Your Niche Empire                     │
│      Choose a quick start template or create custom         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  🛍️ E-commerce       │  │  💻 SaaS Business    │        │
│  │                       │  │                       │        │
│  │  Complete online      │  │  Software product    │        │
│  │  store with products  │  │  with landing pages  │        │
│  │                       │  │                       │        │
│  │  📦 Smart Home       │  │  📦 Project Mgmt     │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  📝 Content          │  │  🔧 Service          │        │
│  │  Business             │  │  Business            │        │
│  │                       │  │                       │        │
│  │  Content-focused      │  │  Service booking     │        │
│  │  with blog & social   │  │  and communication   │        │
│  │                       │  │                       │        │
│  │  📦 Health & Fitness │  │  📦 Home Services    │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                              │
│  ────────────────────  Want full control?  ────────────────│
│                                                              │
│              ┌──────────────────────────┐                   │
│              │  ➕ Start from Scratch  │                   │
│              └──────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Components

**Template Cards**
- White background with gray border
- Blue border on hover
- Large emoji icon (5xl size)
- Template name (xl, bold)
- Description text (gray-600)
- Niche tag with icon (small, gray-500)
- Shadow on hover
- Smooth transition animations

**Custom Start Button**
- Purple-to-blue gradient background
- White text
- Large padding (8x4)
- Rounded corners
- Shadow effect
- Hover state with enhanced shadow

---

## Step 2: Configuration

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Configure Your Empire              [← Back]                 │
│  Customize every aspect of your niche business              │
├──────────────────────────────────────┬──────────────────────┤
│                                       │                      │
│  ┌─── Basic Information ──────────┐  │  ┌─ Brand Colors ─┐ │
│  │ Niche / Industry *             │  │  │                 │ │
│  │ [_____________________]        │  │  │ Primary:   🎨   │ │
│  │                                │  │  │ [#2563eb]       │ │
│  │ Business Name *                │  │  │                 │ │
│  │ [_____________________]        │  │  │ Secondary: 🎨   │ │
│  │                                │  │  │ [#1e40af]       │ │
│  │ Target Audience *              │  │  │                 │ │
│  │ [_____________________]        │  │  │ Accent:    🎨   │ │
│  └────────────────────────────────┘  │  │ [#f59e0b]       │ │
│                                       │  │                 │ │
│  ┌─── Products ──────────────────┐  │  │                 │ │
│  │ Enable [✓]                     │  │  │                 │ │
│  │                                │  │  │                 │ │
│  │ Product Types:                 │  │  │                 │ │
│  │ ☑ Physical Products            │  │  │ ┌─────────────┐ │ │
│  │ ☑ Digital Products             │  │  │ │  Generate   │ │ │
│  │ ☐ Service Products             │  │  │ │   Empire    │ │ │
│  │                                │  │  │ └─────────────┘ │ │
│  │ Number of Products: 10         │  │  └─────────────────┘ │
│  │ ├────●─────────────────┤       │  │                      │
│  │ 1                    20        │  │                      │
│  └────────────────────────────────┘  │                      │
│                                       │                      │
│  ┌─── Content Marketing ─────────┐  │                      │
│  │ Enable [✓]                     │  │                      │
│  │                                │  │                      │
│  │ ┌───┐ ┌───┐ ┌───┐             │  │                      │
│  │ │📝 │ │📱 │ │🎬 │             │  │                      │
│  │ │Blog│Social│Video│            │  │                      │
│  │ └───┘ └───┘ └───┘             │  │                      │
│  │ ┌───┐ ┌───┐ ┌───┐             │  │                      │
│  │ │📧 │ │📢 │ │🚀 │             │  │                      │
│  │ │Email│ Ads │Land │            │  │                      │
│  │ └───┘ └───┘ └───┘             │  │                      │
│  └────────────────────────────────┘  │                      │
│                                       │                      │
│  [More configuration sections...]    │                      │
└──────────────────────────────────────┴──────────────────────┘
```

### Components

**Section Cards**
- White background
- Rounded corners (xl)
- Shadow (sm)
- Gray border
- 6-unit padding

**Input Fields**
- Full width
- Gray border (300)
- Blue focus ring
- Rounded corners (lg)
- 4-unit padding

**Checkboxes**
- Blue accent color
- Rounded
- 4-5 units size
- Focus ring

**Slider**
- Gray track (200)
- Blue thumb
- Rounded
- Full width

**Content Type Grid**
- 2 columns on small screens
- 3 columns on large screens
- Cards with icons and labels
- Blue border when selected
- Blue background when selected

**Color Pickers**
- Color input (circular)
- Text input for hex code
- Monospace font for hex
- Side-by-side layout

**Generate Button**
- Blue-to-purple gradient
- White text
- Large size (full width)
- Shadow effect
- Disabled state when incomplete
- Lightning bolt icon

---

## Step 3: Generation Progress

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                     ┌──────────┐                            │
│                     │    ⚡     │  (Pulsing)                 │
│                     └──────────┘                            │
│                                                              │
│               Generating Your Empire                        │
│     Please wait while we create your business...           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                                                      │    │
│  │  ● Generate 10 Products                             │    │
│  │  ├──────────────────────────────────────────────┤  │    │
│  │  │██████████████████████████████████░░░░░░░░░░░│  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                                        75%          │    │
│  │                                                      │    │
│  │  ✓ Generate Blog Content                           │    │
│  │  ✓ Generate Social Media                           │    │
│  │  ⊙ Generate Email Copy         (Spinning)          │    │
│  │  ○ Build Website                (Pending)           │    │
│  │  ○ Create Email Campaigns       (Pending)           │    │
│  │  ○ Finalize & Package           (Pending)           │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ℹ️  This may take a few minutes                     │  │
│  │                                                        │  │
│  │  We're creating 10 products, generating content,     │  │
│  │  building your website, and setting up email         │  │
│  │  campaigns. Feel free to grab a coffee!              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Components

**Progress Icon**
- Gradient background (blue to purple)
- Circular shape
- Lightning bolt icon
- Pulsing animation

**Progress Card**
- White background
- Large shadow
- Blue border
- 8-unit padding

**Status Icons**
- **Completed**: Green circle with checkmark
- **In Progress**: Blue circle with spinning loader
- **Pending**: Gray circle (small dot)
- **Error**: Red circle with X

**Progress Bars**
- Gray background (200)
- Blue fill (in-progress)
- Green fill (completed)
- Height: 2 units
- Rounded
- Smooth transitions

**Info Box**
- Blue background (50)
- Blue border (200)
- Information icon
- Blue text
- 4-unit padding

---

## Step 4: Complete

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                     ┌──────────┐                            │
│                     │    ✓     │  (Green gradient)          │
│                     └──────────┘                            │
│                                                              │
│              Your Empire is Ready! 🎉                       │
│   We've successfully generated your complete                │
│           SmartHome Pro niche business                      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Products   │  │   Content    │  │   Emails     │     │
│  │              │  │              │  │              │     │
│  │    📦        │  │    ✏️        │  │    📧        │     │
│  │              │  │              │  │              │     │
│  │     10       │  │      6       │  │      2       │     │
│  │              │  │              │  │              │     │
│  │ Physical...  │  │ Content...   │  │ Email...     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌────────────── Generated Files ─────────────────────┐    │
│  │                                                      │    │
│  │  📦  Products                       [View Files]    │    │
│  │      10 product files • JSON & CSV                  │    │
│  │  ───────────────────────────────────────────────    │    │
│  │  🌐  Website                        [Preview]       │    │
│  │      Complete default template • HTML, CSS, JS      │    │
│  │  ───────────────────────────────────────────────    │    │
│  │  📝  Marketing Content             [View Content]   │    │
│  │      6 content types • Ready to publish             │    │
│  │  ───────────────────────────────────────────────    │    │
│  │  📧  Email Campaigns               [View Emails]    │    │
│  │      2 automated sequences • HTML emails            │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────┐  ┌────────────────────────────┐     │
│  │ Create Another   │  │  Download All Files        │     │
│  │    Empire        │  │                            │     │
│  └──────────────────┘  └────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Components

**Success Icon**
- Green gradient background
- Large circular shape
- Checkmark icon
- Slightly larger than progress icon

**Summary Cards**
- 3-column grid
- White background
- Shadow (sm)
- Colored icon circles:
  - Products: Blue
  - Content: Purple
  - Emails: Green
- Large number display (3xl, bold)
- Description text

**File List**
- White background
- Large shadow
- Border (gray-200)
- Individual file rows with:
  - Colored icon circle
  - File type name (bold)
  - File description (small, gray)
  - Action button (colored text)
  - Divider lines between rows

**Action Buttons**
- **Create Another**: Gray border, white background
- **Download All**: Blue-to-purple gradient, white text
- Side-by-side layout
- Large padding
- Rounded corners
- Shadow effects

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Stacked template cards
- Full-width buttons
- Simplified navigation
- Collapsible sections

### Tablet (640px - 1024px)
- 2-column template grid
- 2-column summary cards
- Optimized spacing
- Side-by-side forms

### Desktop (> 1024px)
- 2-column configuration layout
- 3-column summary cards
- Sticky sidebar
- Maximum width constraint (7xl)
- Generous whitespace

---

## Animations

### Hover Effects
- Card elevation (shadow increase)
- Border color change
- Smooth color transitions
- Scale transforms (subtle)

### Active States
- Button press effects
- Focus rings on inputs
- Highlight animations

### Progress Animations
- Pulsing icon
- Spinning loader
- Progress bar fills
- Smooth transitions (300ms)

### Page Transitions
- Fade in/out
- Slide animations
- Smooth step changes

---

## Accessibility Features

### Semantic HTML
- Proper heading hierarchy
- Button elements for actions
- Label associations
- ARIA labels where needed

### Keyboard Navigation
- Tab order
- Focus indicators
- Enter/Space activation
- Escape to close

### Color Contrast
- WCAG AA compliance
- Sufficient contrast ratios
- Color-independent information

### Screen Readers
- Descriptive text
- Status announcements
- Form labels
- Error messages

---

## Interactive States

### Buttons
- **Default**: Solid/gradient background
- **Hover**: Enhanced shadow, darker shade
- **Active**: Slightly scaled down
- **Disabled**: Reduced opacity, cursor not-allowed

### Inputs
- **Default**: Gray border
- **Focus**: Blue ring, blue border
- **Error**: Red border, red text
- **Disabled**: Gray background, cursor not-allowed

### Cards
- **Default**: White background, gray border
- **Hover**: Blue border, elevated shadow
- **Selected**: Blue border, blue background tint
- **Active**: Pressed appearance

---

## Design Tokens

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px (circles)

### Shadow Scale
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- xl: 0 20px 25px rgba(0,0,0,0.1)

---

This visual guide provides a comprehensive overview of the dashboard's design system and user interface. All components follow consistent patterns and maintain visual harmony throughout the application.
