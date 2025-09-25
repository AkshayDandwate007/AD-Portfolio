# TODO: Fix Scrolling Effect in Experience and Project Sections (Desktop Mode)

## Information Gathered:
- Current CSS has scrolling styles only for mobile devices (max-width: 1024px)
- JavaScript scroll effects (fade-in, progress bar) are only applied to mobile
- Desktop mode lacks proper scrolling implementation for `.wrd-container` (experience) and `.portfolio-box` (projects)
- User reports scrolling not working in desktop mode

## Plan:
1. **Update CSS (style.css)**:
   - Add desktop-specific scrolling styles for `.wrd-container` and `.portfolio-box`
   - Implement custom scrollbar styling for desktop
   - Ensure proper overflow and height constraints for desktop

2. **Update JavaScript (script.js)**:
   - Extend scroll fade-in and progress bar logic to desktop mode
   - Add desktop-specific scroll event handling
   - Ensure smooth scrolling behavior

3. **Test and Verify**:
   - Verify scrolling works in desktop mode
   - Check that experience and project sections scroll properly
   - Ensure no layout issues on desktop

## Dependent Files to be Edited:
- `style.css`: Add desktop scrolling styles
- `script.js`: Add desktop scroll handling

## Followup Steps:
- Test the implementation in desktop mode
- Verify smooth scrolling and progress indicators
- Check for any layout or performance issues
