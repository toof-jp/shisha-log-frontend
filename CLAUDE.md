# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Run production server**: `npm run start`
- **Type check**: `npm run typecheck`


## Architecture Overview

This is a React Router v7 frontend application for Shisha Log configured as a Single Page Application (SPA). The project uses:

- **Vite** as the build tool
- **TypeScript** for type safety with path alias `~/*` mapping to `./app/*`
- **TailwindCSS v4** for styling with dark mode support
- **File-based routing** with explicit route configuration in `app/routes.ts`
- **JWT-based authentication** with email/password
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation for forms

## Key Project Structure

- `app/root.tsx` - Root layout with QueryClient provider and error boundaries
- `app/routes.ts` - Route configuration with auth guards and layouts
- `app/lib/` - Core utilities (Supabase client, API client, utils)
- `app/hooks/` - Custom hooks for authentication and API calls
- `app/components/` - Reusable components (auth guard, layout, navbar)
- `app/types/` - TypeScript type definitions for API responses

## Authentication Flow

- Users authenticate with email/password
- JWT tokens are stored in localStorage and automatically attached to API requests
- Protected routes use `AuthGuard` component
- Unauthenticated users are redirected to `/login`

## API Integration

- Backend API base URL: `http://localhost:8080/api/v1`
- All API calls (except health) require JWT authentication
- API client automatically handles token attachment and auth errors
- Uses TanStack Query for caching and state management

## Environment Variables

Create `.env` file with:
- `VITE_API_BASE_URL` - Backend API URL (defaults to localhost:8080)

## Important Notes

- No testing framework or linting is currently configured
- Docker support with nginx for serving static files
- Build output goes to `build/client/` directory
- Generated types are in `.react-router/` directory