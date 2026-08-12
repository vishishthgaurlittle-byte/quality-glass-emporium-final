---
name: Artisan Clarity
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#43474e'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#73777f'
  outline-variant: '#c3c6cf'
  surface-tint: '#406185'
  primary: '#00162c'
  on-primary: '#ffffff'
  primary-container: '#002b4d'
  on-primary-container: '#7393bb'
  inverse-primary: '#a8c9f3'
  secondary: '#005faf'
  on-secondary: '#ffffff'
  secondary-container: '#479afd'
  on-secondary-container: '#00315f'
  tertiary: '#1e1300'
  on-tertiary: '#ffffff'
  tertiary-container: '#382600'
  on-tertiary-container: '#ae8b46'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#a8c9f3'
  on-primary-fixed: '#001d36'
  on-primary-fixed-variant: '#27496c'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a5c8ff'
  on-secondary-fixed: '#001c3a'
  on-secondary-fixed-variant: '#004786'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4201'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  charcoal-bg: '#1A1C1E'
  glass-tint: '#F4F7F9'
  success-green: '#117B01'
  subtle-gray: '#777777'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter-desktop: 32px
  gutter-mobile: 16px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1280px
---

## Brand & Style

The design system for the product reflects an **Artisan Modern** aesthetic. It balances the utilitarian efficiency of major e-marketplaces with the tactile, premium feel of a boutique frame shop. The brand personality is trustworthy, precise, and sophisticated—evoking the clarity of high-grade glass and the sturdy reliability of handcrafted frames.

The visual style is characterized by:
- **Clean Professionalism:** A structured layout that prioritizes high-resolution product imagery and clear technical specifications.
- **Modern Minimalism:** Heavy use of purposeful whitespace to let the "art" (the user's potential photos or the glass products) breathe.
- **Tactile Depth:** Subtle use of layered surfaces and soft shadows to mimic the physical stacking of a photo frame or the refractive quality of acrylic.
- **Trust-Oriented:** A conservative but contemporary color palette that signals longevity and quality.

## Colors

The palette is anchored in **Deep Navy (#002B4D)** and **Charcoal**, providing a foundation of authority and professional trust. This is contrasted with a vibrant **Action Blue (#0076D7)** derived from the heritage brand for familiarity and high-conversion CTAs.

- **Primary:** Deep Navy for headers, primary text, and grounding elements.
- **Secondary:** Action Blue for interactive elements, links, and primary buttons.
- **Tertiary:** Metallic Gold (#C5A059) used sparingly for "Premium" or "Artisanal" badges and high-value highlights.
- **Neutral:** A range of grays for secondary information and borders.

The design system supports a **Dark Mode** where the `charcoal-bg` becomes the primary surface, and the glass-like transparency effects are amplified with subtle edge highlights.

## Typography

The design system utilizes **Manrope** for all levels. Its geometric structure feels technical and modern, while its subtle warmth maintains the artisanal feel required for a framing business. 

- **Display & Headlines:** Use tighter letter spacing and heavier weights to command attention on product detail pages.
- **Body Text:** Standard weight for high readability. Line heights are generous (1.5x) to prevent dense product descriptions from feeling overwhelming.
- **Labels:** Medium weights are used for UI metadata and form labels to ensure they stand out against background surfaces.

## Layout & Spacing

This design system uses a **12-column Fixed Grid** for desktop and a **Fluid 2-column Grid** for mobile. The layout philosophy centers on "Generous Balance," using white space to separate product categories and specifications.

- **Rhythm:** An 8px base unit drives all padding and margin decisions.
- **Desktop:** 12 columns with 32px gutters allow for complex product configuration sidebars next to large image galleries.
- **Mobile:** 20px side margins ensure content does not feel cramped on smaller devices.
- **Reflow:** On tablets, the 12-column grid collapses to 8 columns, and sidebars move below the primary product image gallery.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Subtle Glassmorphism**. 

- **Surfaces:** In light mode, the primary surface is white. Secondary containers (like "Similar Products") use a very light `glass-tint` gray to create soft separation without harsh lines.
- **Shadows:** Shadows are highly diffused and low-opacity (5-10%), used primarily to lift product cards and floating action buttons.
- **Glass Effects:** For acrylic product showcases, use a backdrop blur (12px) with a 1px semi-transparent white border to simulate the edge of a glass sheet.
- **Z-Index:** Modals and image zoom overlays sit at the highest elevation, using a dimmed backdrop (60% opacity) to focus the user's attention.

## Shapes

The shape language is **Soft and Structural**. Elements follow a `0.25rem` (4px) base radius to echo the precise but not sharp edges of high-quality glass and frame corners.

- **Buttons & Inputs:** Use the standard `rounded` (4px) for a professional look.
- **Product Cards:** Use `rounded-lg` (8px) to provide a gentler, more modern appearance for large image containers.
- **Badges:** Pill-shaped (fully rounded) for small status indicators (e.g., "In Stock").

## Components

- **Buttons:** Primary buttons use a solid `secondary` fill with white text. Secondary buttons use an outline style with the `primary` color. Hover states should involve a subtle shift in lightness (10%).
- **Input Fields:** Use a 1px border (`subtle-gray`) with a 4px corner radius. Focused states should use a 2px `secondary` blue border.
- **Chips:** Used for frame material selection (e.g., "Wood," "Aluminum," "Acrylic"). They feature a light gray background that turns `primary` navy when selected.
- **Cards:** Product cards must include a subtle 1px border to define the frame of the image. The price and title should be clearly separated using the `label-md` and `headline-md` tokens.
- **Checkboxes & Radios:** Should be custom-styled in the `secondary` blue to maintain brand consistency over browser defaults.
- **Framing Configurator:** A unique component for this system—a floating panel that allows users to toggle frame styles and see real-time updates on a mock-up image. This should use the "glassmorphism" style for its background.