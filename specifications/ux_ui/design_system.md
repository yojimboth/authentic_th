# Global Design System: authentic_th

This document defines the comprehensive visual and interactive standards for the `authentic_th` ecosystem. It ensures a unified brand experience while tailoring the interface to the specific operational needs of three distinct personas: the **Customer**, the **Restaurant Operator**, and the **System Administrator**.

---

## 1. Color Specification

All colors are implemented via **Tailwind CSS / NativeWind** configuration. To allow for persona-switching, the primary brand colors are mapped to a `brand` namespace in the `tailwind.config.js`.

### 1.1 Core Brand Mapping
The primary color changes based on the application context to provide immediate visual orientation.

| Persona | Primary (`brand-primary`) | Secondary (`brand-secondary`) | Usage Context |
| :--- | :--- | :--- | :--- |
| **Customer** | `bg-brand-orange` (#FF6B00) | `bg-brand-amber` (#F59E0B) | Fresh, appetising, energetic. |
| **Restaurant** | `bg-brand-teal` (#008080) | `bg-brand-slate` (#64748B) | Focused, calm, operational. |
| **Admin** | `bg-brand-indigo` (#4F46E5) | `bg-brand-violet` (#7C3AED) | Stable, professional, authoritative. |

### 1.2 Functional Colors (Global)
These colors remain consistent across all applications to maintain universal meaning for system states.

| State | Tailwind Class | Hex Code | Application |
| :--- | :--- | :--- | :--- |
| **Success** | `text-emerald-500` / `bg-emerald-500` | `#10B981` | Payments complete, Orders ready. |
| **Warning** | `text-amber-500` / `bg-amber-500` | `#F59E0B` | Pending payments, Low stock. |
| **Danger** | `text-rose-500` / `bg-rose-500` | `#F43F5E` | Order cancelled, System errors. |

### 1.3 Neutral Scales (Persona-Specific)
Used for backgrounds, borders, and secondary text to reinforce the "mode" of the app.

- **Customer App**: `zinc` scale. Use `zinc-50` for backgrounds and `zinc-900` for primary text. (Creates a "clean/modern" feel).
- **Restaurant App**: `slate` scale. Use `slate-100` for backgrounds and `slate-900` for primary text. (Creates a "utilitarian/industrial" feel).
- **Admin Portal**: `zinc` scale. High contrast: `zinc-50` background, `zinc-400` for borders, `zinc-900` for text.

---

## 2. Typography Guide

Typography is optimized for readability. The system utilizes **Inter** as the global workhorse and **Poppins** for high-impact branding in the customer experience.

### 2.1 Font Families
- **Base/Body**: `font-inter` (Inter) — All apps, all levels.
- **Headings (Customer App Only)**: `font-poppins` (Poppins) — Page titles and section headers.

### 2.2 Type Scale Mapping

| Level | Tailwind Classes | Size / Weight | Usage |
| :--- | :--- | :--- | :--- |
| **h1** | `text-3xl font-bold leading-tight` | 30px / 700 | Main Page Titles |
| **h2** | `text-2xl font-semibold leading-snug` | 24px / 600 | Section Headings |
| **h3** | `text-lg font-medium leading-normal` | 18px / 500 | Card Titles, Modal Headers |
| **body** | `text-base font-normal leading-relaxed`| 16px / 400 | Standard Paragraphs/Labels |
| **caption**| `text-xs font-normal text-zinc-500` | 12px / 400 | Metadata, Helper Text, Dates |

---

## 3. Component Library Specifications (Atoms)

### 3.1 Button
The primary action element. Must use `rounded-lg` (8px) for a modern, friendly feel.

- **Layout**: `px-4 py-2` (Standard), `px-6 py-3` (Large/CTA).
- **Border Radius**: `rounded-lg`.

| Variant | Default State | Hover/Active State | Disabled State |
| :--- | :--- | :--- | :--- |
| **Primary** | `bg-brand-primary text-white` | `brightness-90` | `bg-zinc-200 text-zinc-400` |
| **Secondary**| `border-2 border-brand-primary text-brand-primary` | `bg-brand-primary/10` | `border-zinc-200 text-zinc-400` |
| **Ghost** | `text-zinc-600 hover:bg-zinc-100` | `bg-zinc-100` | `text-zinc-300` |
| **Danger** | `bg-rose-500 text-white` | `bg-rose-600` | `bg-rose-200 text-rose-400` |

- **Loading State**: Replace text with a `spinner` (size 5) and set `pointer-events-none`.

### 3.2 Input Field
- **Layout**: `px-3 py-2 border rounded-md` (6px radius).
- **Visual States**:
    - **Default**: `border-zinc-300 bg-white text-zinc-900`.
    - **Focus**: `border-brand-primary ring-2 ring-brand-primary/20`.
    - **Error**: `border-rose-500 ring-rose-500/20`.
    - **Disabled**: `bg-zinc-50 border-zinc-200 text-zinc-400`.

### 3.3 Card
- **Layout**: `p-4 bg-white border border-zinc-200 rounded-xl shadow-sm`.
- **Variants**:
    - **Elevated**: `shadow-md border-transparent` (Used for featured food items).
    - **Flat**: `border-zinc-100 shadow-none` (Used for list items).

### 3.4 Modal & Bottom-Sheet
- **Web/Admin**: Center-overlay, `max-w-lg`, `rounded-2xl`, `shadow-2xl`.
- **Mobile (Customer/Rest)**: Bottom-sheet animation, `rounded-t-3xl`, `h-1/2` to `h-3/4`.
- **Backdrop**: `bg-black/50 backdrop-blur-sm`.

### 3.5 Badge
- **Layout**: `px-2 py-0.5 rounded-full text-xs font-semibold`.
- **Variants**:
    - **Success**: `bg-emerald-100 text-emerald-700`.
    - **Warning**: `bg-amber-100 text-amber-700`.
    - **Danger**: `bg-rose-100 text-rose-700`.
    - **Neutral**:, `bg-zinc-100 text-zinc-700`.

### 3.6 Table (Web Admin/Rest)
- **Header**: `bg-zinc-50 text-zinc-500 uppercase text-xs font-bold`.
- **Rows**: `border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors`.
- **Cell Padding**: `px-4 py-3`.

---

## 4. Iconography & Imagery

### 4.1 Iconography Standard
- **Library**: `Lucide React` (Web) / `Expo Vector Icons` (Mobile).
- **Sizing**:
    - **Small (Caption/Badge)**: `14px` / `w-3.5 h-3.5`.
    - **Standard (Buttons/Menu)**: `20px` / `w-5 h-5`.
    - **Large (Empty States)**: `48px` / `w-12 h-12`.
- **Stroke**: Consistent `2px` stroke width.

### 4.2 Imagery & Aspect Ratios
To ensure layout stability (preventing layout shift), the following ratios are mandated:

| Image Type | Aspect Ratio | Tailwind Class | Requirement |
| :--- | :--- | :--- | :--- |
| **Food Item** | 1:1 (Square) | `aspect-square` | Center-cropped, white background or lifestyle. |
| **Banner/Hero**| 16:9 (Widescreen)| `aspect-video` | High-resolution photography. |
| **Restaurant Profile**| 4:3 (Landscape) | `aspect-[4/3]` | Storefront imagery. |
| **User Avatar** | 1:1 (Circle) | `rounded-full` | Center-crop. |

---

## 5. Implementation Note for @ivan
When implementing these in the frontend:
1. Define the `brand-primary` and `brand-secondary` in `tailwind.config.js` using CSS variables (e.g., `--color-primary`).
2. Update the CSS variables based on the app being launched (Customer vs Restaurant vs Admin).
3. Use the `font-poppins` and `font-inter` utility classes strictly as defined.
