# Observer Finance - Architecture Documentation

A personal financial tracking application designed to monitor expenses, income, assets, liabilities, investments, and more. Currently in early development with a client-side React application.

## Project Overview

Observer Finance is a fullstack financial tracking application currently consisting of a modern React frontend. The backend (NestJS server) is in transition and not yet fully integrated. The application focuses on providing users with comprehensive insights into their financial situation through dashboards, transaction tracking, and data visualization.

---

## Architecture Overview

### Client-Server Architecture

```
observer-finance/
├── client/          # React 19 + TypeScript frontend (ACTIVE)
└── server/          # NestJS backend (in transition - currently not deployed)
```

**Current Status**: Client-only application with static data. The backend exists but is marked for deletion in the current git state, indicating a potential rebuild or migration in progress.

---

## Tech Stack

### Frontend (Client)

**Core Framework & Tooling:**
- **React 19.1.1** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7.1** - Build tool and dev server
- **React Router 7.9** - Client-side routing

**Styling & UI:**
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **shadcn/ui** - Headless component library (Radix UI based)
  - Dialog, Dropdown, Select, Popover, Tabs, Sidebar, etc.
- **Lucide React** - Icon library
- **Tabler Icons** - Additional icon set
- **class-variance-authority** - Component variant management

**State & Data:**
- **React Context API** - Theme management (dark/light mode)
- **Static Data/JSON** - Currently using hardcoded data (data.json files)
- **localStorage** - Client-side storage for preferences (e.g., theme)

**Advanced Features:**
- **TanStack React Table (v8.21)** - Advanced data tables with:
  - Sorting, filtering, pagination
  - Row selection, column visibility
  - Faceted search
- **dnd-kit** - Drag-and-drop functionality for table row reordering
- **Recharts 2.15** - Chart and visualization library
- **date-fns 4.1** - Date manipulation and formatting
- **Zod 4.1** - Schema validation
- **Sonner 2.0** - Toast notifications
- **next-themes** - Theme provider

**Development Tools:**
- **ESLint 9.36** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **React Refresh** - Fast refresh during development

---

## Directory Structure

### Client Source Layout

```
client/src/
├── app/                          # App-level configuration/settings
│   └── dashboard/                # Dashboard configuration
│
├── components/
│   ├── Authentication/           # Auth pages
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   │
│   ├── Dashboard/                # Main dashboard page
│   │   ├── Dashboard.tsx         # Main dashboard component
│   │   ├── components/           # Dashboard sub-components
│   │   │   ├── app-sidebar.tsx   # Navigation sidebar
│   │   │   ├── site-header.tsx   # Header component
│   │   │   ├── section-cards.tsx # Summary cards
│   │   │   ├── chart-area-interactive.tsx # Chart visualization
│   │   │   ├── nav-main.tsx      # Main navigation menu
│   │   │   ├── nav-documents.tsx # Document navigation
│   │   │   ├── nav-secondary.tsx # Secondary navigation
│   │   │   ├── nav-user.tsx      # User dropdown menu
│   │   │   └── DataTable/        # Transaction table
│   │   │       ├── DataTable.tsx # Advanced table with drag-drop
│   │   │       └── Drawer.tsx    # Row detail drawer
│   │   └── data.json             # Dashboard sample data
│   │
│   ├── Income/
│   │   └── Income.tsx            # Income page (stub)
│   │
│   ├── Investments/
│   │   └── Investments.tsx       # Investments page (stub)
│   │
│   ├── Dialog/
│   │   └── AddTransactionDialog/
│   │       └── AddTrannsactionDialog.tsx # Add transaction modal
│   │
│   ├── DatePicker/
│   │   └── DatePicker.tsx        # Date picker component
│   │
│   ├── Select/
│   │   └── SelectComponent.tsx   # Select dropdown wrapper
│   │
│   ├── Theme/
│   │   ├── theme-provider.tsx    # Theme context provider (dark/light)
│   │   └── ModeToggle.tsx        # Theme toggle button
│   │
│   └── ui/                       # shadcn/ui primitive components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── sidebar.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── checkbox.tsx
│       ├── dropdown-menu.tsx
│       ├── popover.tsx
│       ├── tooltip.tsx
│       ├── calendar.tsx
│       ├── chart.tsx
│       └── [other shadcn/ui components]
│
├── hooks/
│   └── use-mobile.ts             # Responsive mobile detection hook
│
├── lib/
│   └── utils.ts                  # Utility functions (cn: classname merger)
│
├── STATIC_DATA/
│   └── STATIC_DATA.ts            # Static data constants
│       ├── categories: ["Food", "Transportation", "Education", "Subscription", "Bills"]
│       └── transactionType: ["Expense", "Income", "Savings", "Liability", "Investment"]
│
├── assets/
│   └── react.svg                 # React logo
│
├── App.tsx                       # Main app component with routing
├── main.tsx                      # React entry point
├── index.css                     # Global styles (Tailwind imports)
└── App.css                       # App-level styles
```

### Root Configuration Files

```
client/
├── vite.config.ts               # Vite configuration with @ alias
├── tsconfig.json                # TypeScript base config with path aliases
├── tsconfig.app.json            # App-specific TypeScript config
├── tsconfig.node.json           # Node/build tools TypeScript config
├── components.json              # shadcn/ui component registry
├── eslint.config.js             # ESLint configuration
├── package.json                 # Dependencies and scripts
├── index.html                   # HTML entry point
└── public/
    └── vite.svg                 # Vite logo
```

---

## Routing & Navigation

**Current Routes** (defined in `App.tsx`):

```
/              -> LoginForm (default)
/login         -> LoginForm
/signup        -> SignupForm
/dashboard     -> Dashboard (main page with sidebar, charts, data table)
/income        -> Income (stub page)
/investments   -> Investments (stub page)
```

**Navigation Structure:**
- Primary navigation via React Router in `<Routes>`
- Sidebar navigation in Dashboard with links to main pages
- Theme toggle in header

---

## Key Components & Features

### Authentication Pages
- **LoginForm.tsx** - Email/password login, Google OAuth button
- **SignupForm.tsx** - Account creation form

### Dashboard (Main Page)
**Layout Components:**
- **AppSidebar** - Collapsible sidebar with navigation menu
- **SiteHeader** - Top header with user info and controls
- **SectionCards** - Summary cards (likely showing totals, balances)
- **ChartAreaInteractive** - Interactive chart using Recharts

**Data Table Features:**
- Drag-and-drop row reordering (dnd-kit)
- Column sorting and filtering
- Row selection with checkboxes
- Pagination (10, 20, 30, 40, 50 rows per page)
- Column visibility toggles
- Merchant, Category, Status, Amount columns
- Row actions (Edit, Copy, Delete)
- Multiple tabs: Transactions, Bills, Loans, Receivables

### State Management
- **React Context** for theme (dark/light mode)
  - Stored in localStorage
  - Auto-detects system preference
- **React hooks** for component-level state (useState, useEffect, useContext)
- **No Redux/Zustand** - Simple state management via hooks

---

## Data Flow

### Current (Static Data)
```
Static Data (data.json, STATIC_DATA.ts)
    ↓
React Components (Dashboard, DataTable)
    ↓
UI Rendering (Tailwind + shadcn/ui)
```

### Future (When Backend Integrates)
```
NestJS Backend (API endpoints)
    ↓
Fetch/Axios requests
    ↓
React State (Hooks/Context)
    ↓
Components & UI
```

---

## Development Workflow

### Scripts
- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run build` - TypeScript check + Vite build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Key Configurations

**Vite Config:**
- React plugin for fast refresh
- Tailwind CSS plugin
- Path alias: `@` -> `./src`

**TypeScript:**
- Base URL: `.`
- Path alias: `@/*` -> `./src/*`
- Strict mode enabled
- Target: ES2020

**shadcn/ui Setup:**
- Style: New York
- UI Library: Lucide
- Aliases: Components (@/components), Utils (@/lib/utils), UI (@/components/ui)

---

## Component Design Patterns

### UI Components
- **Radix UI primitives** wrapped by shadcn/ui for accessibility
- **Tailwind CSS** for styling
- **CVA (class-variance-authority)** for component variants
- **Utility classname merger** (`cn` function from utils.ts)

### Feature Components
- **Page components** (Dashboard, Income, Investments)
  - Use sidebar layout provided by AppSidebar
  - Implement SiteHeader for page titles
  
- **Dialog components**
  - AddTransactionDialog for creating new transactions
  
- **Table components**
  - TanStack React Table for advanced features
  - dnd-kit for drag-and-drop

### Custom Hooks
- `use-mobile.ts` - Responsive mobile detection

### Providers
- **BrowserRouter** (from React Router) - Wraps entire app
- **ThemeProvider** - Custom context for theme management

---

## Styling

### Tailwind CSS v4
- **Utility-first** approach
- **Custom theme variables** in `index.css` for colors, radius, spacing
- **Dark mode** support (CSS class-based)
- **Container queries** for responsive components
- **Animations** from `tw-animate-css` plugin

### Color System
- oklch color space for precise color control
- CSS custom properties for dynamic theming
- Semantic colors: background, foreground, card, primary, secondary, muted, accent, destructive
- Chart-specific colors for Recharts

---

## State & Data Management

### Current Implementation
- **Static JSON files** (dashboard data, transaction samples)
- **React hooks** (useState, useEffect, useContext)
- **localStorage** for theme preference persistence
- **React Context** for theme state sharing

### Data Sources
- `STATIC_DATA.ts` - Constants (categories, transaction types)
- `data.json` - Sample transaction data
- Component-level state via hooks

---

## Configuration & Build

### Module Resolution
- ES modules (type: "module" in package.json)
- TypeScript paths: `@/*` -> `./src/*`

### Build Output
- Vite builds to `dist/` directory
- TypeScript checking before build
- Optimized chunks for production

### Development Server
- Vite on port 5173 (default)
- Fast HMR (Hot Module Replacement)
- React Refresh for instant component updates

---

## Current Limitations & Todos

### Backend Status
- NestJS server exists but is being transitioned/removed
- No API integration yet - all data is static
- No authentication backend - login/signup are UI-only stubs

### Features in Development
- Income page (layout only, no content)
- Investments page (layout only, no content)
- AddTransactionDialog component (exists but not fully integrated)

### UI/UX
- Chart visualization (framework in place, needs data)
- Row detail drawer (exists but may need refinement)
- Multiple data view tabs (tabs exist, content areas are stubs)

---

## Key Dependencies Summary

| Dependency | Version | Purpose |
|------------|---------|---------|
| React | 19.1 | UI framework |
| React Router | 7.9 | Client-side routing |
| TanStack Table | 8.21 | Advanced data tables |
| dnd-kit | 6.3+ | Drag-and-drop |
| Recharts | 2.15 | Chart visualization |
| Tailwind CSS | 4.1 | Styling |
| Radix UI | 1.1+ | Accessible components |
| Zod | 4.1 | Schema validation |
| date-fns | 4.1 | Date utilities |

---

## Getting Started for Developers

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access application:**
   Open http://localhost:5173 in browser

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## Future Development Notes

- **Backend integration**: Connect NestJS API when backend is ready
- **State management**: Consider Zustand/Redux if state complexity grows
- **API client**: Set up axios/fetch wrapper for API calls
- **Testing**: Add Vitest/Jest for unit testing, Playwright for E2E
- **Page completion**: Implement Income and Investments page functionality
- **Form validation**: Utilize Zod schemas across all forms
- **Authentication**: Implement real auth with JWT tokens
- **Real data integration**: Replace static data with API calls

---

## File Path Reference

**Key entry points:**
- `/home/l/projects/observer-finance/client/src/main.tsx` - React bootstrap
- `/home/l/projects/observer-finance/client/src/App.tsx` - Routing & theme
- `/home/l/projects/observer-finance/client/src/components/Dashboard/Dashboard.tsx` - Main page

**Configuration:**
- `/home/l/projects/observer-finance/client/vite.config.ts`
- `/home/l/projects/observer-finance/client/tsconfig.json`
- `/home/l/projects/observer-finance/client/components.json`

