# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Type check**: `npm run typecheck`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React-based Single Page Application (SPA) for tracking and managing shisha (hookah) sessions. The project uses:

- **React 18** with TypeScript for the frontend framework
- **Vite** as the build tool and development server
- **React Router DOM v6** for client-side routing
- **Tailwind CSS** for styling and responsive design
- **Axios** for HTTP client and API communication
- **React Hook Form** with Zod validation for form handling
- **date-fns** for date formatting and manipulation

## Key Project Structure

- `src/types/api.ts` - TypeScript interfaces for API responses and requests
- `src/services/api.ts` - API service class with all backend endpoints
- `src/hooks/useAuth.ts` - Authentication context and hooks
- `src/components/Layout.tsx` - Main layout component with navigation
- `src/pages/` - Page components for each route
- `docs/SPECS.md` - Detailed project specifications

## Authentication Flow

- Users register with user_id, password, and display name
- JWT tokens are stored in localStorage and automatically attached to API requests
- Protected routes use authentication guards to redirect unauthenticated users
- Profile is automatically created upon successful registration

## API Integration

- Backend API base URL: `http://localhost:8080/api/v1` (configurable via VITE_API_BASE_URL)
- All API calls (except auth) require JWT authentication
- API client automatically handles token attachment and auth errors
- Automatic logout and redirect on token expiration

## Environment Variables

Create `.env` file with:
- `VITE_API_BASE_URL` - Backend API URL (defaults to localhost:8080/api/v1)

For local development, also create `.env.local`:
- `VITE_API_BASE_URL=https://localhost:8080/api/v1` - Local backend URL with HTTPS

## Important Notes

- Profile creation is automatically triggered during user registration
- All forms include proper validation and error handling
- Routes are protected with authentication guards
- Responsive design works on mobile and desktop
- Japanese language is used for the UI
- Development server runs on HTTPS with self-signed certificates
- SSL certificates are auto-generated for localhost development