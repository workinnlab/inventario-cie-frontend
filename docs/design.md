# Design System Specification: The Ethereal Archive



## 1. Overview & Creative North Star: "The Digital Curator"

The objective of this design system is to transform the utilitarian nature of inventory management into a serene, editorial experience. We are moving away from the "data-heavy spreadsheet" archetype and toward a **"Digital Curator"** aesthetic.



This system rejects the rigid, boxed-in layouts of traditional enterprise software. Instead, it utilizes **intentional asymmetry, expansive breathing room, and organic layering**. By leveraging large corner radii and tonal depth, we create an interface that feels less like a tool and more like a high-end physical gallery. The "Minimalist" requirement is met not by stripping functionality, but by reducing visual noise—specifically by eliminating borders and traditional dividers in favor of sophisticated surface nesting.



---



## 2. Color & Surface Architecture



Our palette is rooted in nature: Sage Green (`primary`), Soft Blue (`secondary`), and Muted Slate (`tertiary`). These are not just decorative; they define functional zones.



### The "No-Line" Rule

**Borders are strictly prohibited for sectioning.** To separate a sidebar from a main content area, or a header from a body, use background color shifts.

* **Example:** Place a `surface-container-lowest` card on top of a `surface-container-low` section. The change in hex code provides the boundary, maintaining a "borderless" editorial feel.



### Surface Hierarchy & Nesting

Treat the UI as a physical stack of semi-transparent materials.

* **Level 0 (Base):** `surface` or `background` (#f8f9fa).

* **Level 1 (Sections):** `surface-container-low` (#f1f4f5).

* **Level 2 (Primary Cards):** `surface-container-lowest` (#ffffff).

* **Level 3 (Floating/Pop-overs):** Glassmorphism (Semi-transparent `surface-bright` with 20px Backdrop Blur).



### The "Glass & Gradient" Rule

To elevate main Actions (CTAs), use a subtle linear gradient from `primary` (#4f645b) to `primary_dim` (#43574f) at a 135-degree angle. This adds "soul" and a tactile, premium quality that flat fills lack.



---



## 3. Typography: Editorial Clarity

We utilize **Inter** as our typographic backbone. The scale is designed to create a clear "High-Contrast" hierarchy, where headlines are authoritative and body text is airy.



* **Display (Large/Medium):** Reserved for dashboard overviews (e.g., "Total Assets"). Use `-0.02em` letter spacing to feel "custom-set."

* **Headline (Small/Medium):** Used for section titles. These should never be crowded; give them at least `spacing-8` (2.75rem) of top margin.

* **Title (Large/Medium):** For card headings and item names.

* **Body (Medium):** The workhorse for metadata and descriptions.

* **Label (Small):** Use for micro-copy and status tags. Ensure `on-surface-variant` is used for secondary labels to maintain a soft visual hierarchy.



*Director's Note: Use `headline-sm` for page titles but set them in a "hanging" position to the left of the main content grid to embrace intentional asymmetry.*



---



## 4. Elevation & Depth



### The Layering Principle

Hierarchy is achieved through **Tonal Layering**. Instead of a shadow, place a `primary-container` element inside a `surface-container` to draw the eye. The contrast between the Sage tint and the neutral grey is your primary tool for focus.



### Ambient Shadows

When a card must "float" (e.g., a dragged inventory item or a modal):

* **Blur:** 40px to 60px.

* **Opacity:** 4% - 8% of the `on-surface` color.

* **Spread:** -5px (to keep the shadow tight and sophisticated).

* *Never use pure black (#000) for shadows; always tint it with the surface hue.*



### The "Ghost Border" Fallback

If high-density data requires a container boundary for accessibility, use the **Ghost Border**: `outline-variant` at **15% opacity**. It should be felt, not seen.



---



## 5. Components



### Cards & Lists

* **Structure:** No dividers. Use `spacing-4` (1.4rem) of vertical white space to separate list items.

* **Style:** `radius-lg` (2rem). Use `surface-container-lowest` for the card body.

* **Glassmorphism:** For top-level navigation bars or floating "Quick Add" buttons, use `surface` with 70% opacity and a `blur-xl` effect.



### Buttons

* **Primary:** `primary` fill, `on-primary` text. `radius-full`.

* **Secondary:** `secondary-container` fill, `on-secondary-container` text. No border.

* **Tertiary:** Transparent background, `primary` text. Use a subtle `surface-variant` background on `:hover`.



### Status Indicators (High Contrast)

While the system is soft, statuses must be unmistakable:

* **Success:** `primary` (#4f645b) — our Sage serves as the "Safe" state.

* **Warning:** A saturated gold (custom) or `tertiary_fixed`.

* **Danger:** `error` (#a83836) text on `error_container` (#fa746f) background for high-visibility alerts.



### Input Fields

* **Style:** `surface-container-highest` fill. No border.

* **Focus State:** A 2px "Ghost Border" using `primary` at 40% opacity.

* **Radius:** `radius-md` (1.5rem).



### Additional: The "Inventory Pill"

A custom chip for quantity counts. Use `secondary-fixed` for the background and `on-secondary-fixed` for the text. It should feel like a physical tag attached to an item.



---



## 6. Do’s and Don’ts



### Do:

* **Do** embrace negative space. If a layout feels "empty," it’s likely working.

* **Do** use the `radius-xl` (3rem) for large image containers or hero sections.

* **Do** transition between Light and Dark modes using the `surface` and `surface_dim` tokens to ensure the "softness" is maintained in low light.



### Don’t:

* **Don't** use 1px solid lines. Ever.

* **Don't** use sharp 90-degree corners. Even "small" components like checkboxes should have a `radius-sm`.

* **Don't** use standard "Drop Shadows." Use the Ambient Shadow spec to avoid a dated, "Windows 95" depth effect.

* **Don't** crowd the edges. Keep content at least `spacing-6` (2rem) away from the container edges.