# Lenis Smooth Scrolling Implementation

This project now includes Lenis smooth scrolling for enhanced user experience. Here's how it's implemented and how to use it.

## What's Included

### 1. Core Implementation
- **LenisProvider** (`components/providers/lenis-provider.tsx`): Main Lenis initialization
- **Updated Providers** (`components/providers.tsx`): Integrated Lenis into the app
- **GSAP Integration** (`components/animations/gsap-provider.tsx`): ScrollTrigger works with Lenis

### 2. Utility Components
- **SmoothLink** (`components/ui/smooth-link.tsx`): Smooth scrolling navigation links
- **ScrollToTop** (`components/ui/scroll-to-top.tsx`): Animated scroll-to-top button
- **useLenis Hook** (`hooks/use-lenis.ts`): Access Lenis instance and utilities

### 3. Configuration
- **CSS Updates** (`app/globals.css`): Removed default scroll-behavior
- **Layout Integration**: ScrollToTop button added to main layout

## How to Use

### Basic Smooth Scrolling
Lenis is automatically active on all pages. No additional setup needed.

### Smooth Navigation Links
Replace regular anchor links with SmoothLink component:

```tsx
import { SmoothLink } from '@/components/ui/smooth-link'

// Instead of:
<a href="#section">Go to Section</a>

// Use:
<SmoothLink href="#section">Go to Section</SmoothLink>
```

### Programmatic Scrolling
Use the utility functions from the hook:

```tsx
import { scrollTo, scrollToTop, scrollToElement } from '@/hooks/use-lenis'

// Scroll to top
scrollToTop()

// Scroll to specific position
scrollTo(500)

// Scroll to element
scrollToElement('#my-section')

// Scroll with custom options
scrollTo('#section', { offset: -100, duration: 2 })
```

### GSAP ScrollTrigger Integration
ScrollTrigger automatically works with Lenis:

```tsx
useEffect(() => {
  gsap.fromTo('.my-element', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '.my-element',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    }
  )
}, [])
```

## Configuration Options

The Lenis instance is configured with these settings:

```tsx
{
  duration: 1.2,           // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
  direction: 'vertical',   // Scroll direction
  smooth: true,           // Enable smooth scrolling
  mouseMultiplier: 1,     // Mouse wheel sensitivity
  smoothTouch: false,     // Disable on touch devices
  touchMultiplier: 2,     // Touch sensitivity
  infinite: false,        // Disable infinite scroll
}
```

## Best Practices

1. **Use SmoothLink for internal navigation** - Provides consistent smooth scrolling
2. **Test on mobile devices** - smoothTouch is disabled by default for better performance
3. **Use ScrollTrigger refresh** - Call `ScrollTrigger.refresh()` after dynamic content changes
4. **Avoid conflicting scroll libraries** - Remove other smooth scroll implementations

## Troubleshooting

### ScrollTrigger not working
- Ensure GSAP animations are created after Lenis initialization
- Use `ScrollTrigger.refresh()` after content changes

### Performance issues
- Reduce scroll sensitivity with `mouseMultiplier`
- Disable `smoothTouch` on mobile (already done)
- Use `will-change: transform` CSS for animated elements

### Scroll position issues
- Use Lenis methods instead of `window.scrollTo()`
- Access scroll position via `lenis.scroll` property

## Example Usage

See `components/examples/lenis-scroll-example.tsx` for a complete example of Lenis with GSAP ScrollTrigger.