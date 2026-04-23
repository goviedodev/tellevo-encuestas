# Agent Guidelines for Movilidad Survey Project

## Build Commands

- **Build**: `npm run build` (full production build)
- **Type check**: `npm run build.types` (TypeScript compilation check)
- **Client build**: `npm run build.client` (Vite client build)
- **Server build**: `npm run build.server` (SSR build for Cloudflare)

## Lint & Format Commands

- **Lint**: `npm run lint` (ESLint on src/\*_/_.ts\*)
- **Format**: `npm run fmt` (Prettier write)
- **Format check**: `npm run fmt.check` (Prettier check)

## Development Commands

- **Dev server**: `npm start` or `npm run dev` (SSR dev mode)
- **Preview**: `npm run preview` (production preview)

## Code Style Guidelines

### TypeScript & Framework

- **Framework**: Qwik with QwikCity routing
- **JSX**: React-jsx syntax with `@builder.io/qwik` import source
- **Strict mode**: Enabled in tsconfig.json
- **Path aliases**: `~/*` → `./src/*`

### Naming Conventions

- **Components**: PascalCase, exported as `component$()` from Qwik
- **Interfaces**: PascalCase (e.g., `FormState`, `PersonalInfoSectionProps`)
- **Files**: PascalCase for components, camelCase for utilities

### Imports & Types

- **Type imports**: Use `import type` for interfaces (warning enabled)
- **Explicit any**: Disabled (rule turned off)
- **Props**: Destructure in component functions

### Code Structure

- **Components**: Use functional components with Qwik's `component$`
- **Props interface**: Define at top of component files
- **Event handlers**: Use Qwik's `$` suffix (e.g., `onInput$`)
- **Styling**: Bootstrap CSS classes

### Error Handling

- **Validation**: Client-side validation with Bootstrap invalid-feedback
- **Type assertions**: Use `as` for DOM elements (e.g., `e.target as HTMLInputElement`)

### ESLint Rules

- Most TypeScript strict rules enabled
- Some relaxed: no-explicit-any, no-inferrable-types, no-non-null-assertion disabled
- Unused vars: Error level
- Consistent type imports: Warning level
=======
- `npm run build` - Full production build with type checking
- `npm run build.types` - TypeScript type checking only
- `npm run lint` - ESLint on src/\*_/_.ts\* files
- `npm run fmt` - Prettier formatting (write mode)
- `npm run fmt.check` - Prettier formatting check

## Development

- `npm start` or `npm run dev` - Development server with SSR
- `npm run preview` - Preview production build locally

## Code Style Guidelines

### Framework & Language

- **Framework**: Qwik with QwikCity for routing
- **Language**: TypeScript (strict mode enabled)
- **JSX**: React JSX syntax with Qwik JSX import source

### Imports & Paths

- Use `~/*` alias for src directory imports
- Group imports: Qwik imports first, then components, then types
- Use type-only imports for interfaces: `import type { DocumentHead }`

### Components

- Use `component$` wrapper for all components
- PascalCase naming convention
- Props: Define interfaces for component props
- Destructure props at component start

### State Management

- `useStore` for reactive objects with multiple properties
- `useSignal` for simple reactive values
- `useStylesScoped$` for component-scoped CSS

### Styling

- CSS-in-JS with template literals in `useStylesScoped$`
- Bootstrap CSS classes for UI components
- Inline styles only for dynamic values

### Error Handling

- Use try-catch with specific error type annotations
- AbortController for request timeouts (10-second default)
- Graceful error messages for user-facing errors

### TypeScript

- Strict null checks enabled
- Explicit return types for functions
- Interface definitions for complex objects
- Nullable types with `| null` union

### Naming Conventions

- camelCase for variables, functions, and properties
- PascalCase for components, interfaces, and types
- UPPER_CASE for constants and environment variables

### Code Quality

- ESLint with TypeScript rules (some relaxed: no-explicit-any, etc.)
- Prettier for consistent formatting
- No unused variables (error level)
- Consistent type imports (warning level)
