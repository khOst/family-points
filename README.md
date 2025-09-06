# Family Points - React Prototype

A React-based web application for managing family tasks and rewards through a points system.

## Features

- **User Authentication** - Registration and login system
- **Dashboard** - Overview of points, tasks, and group activity
- **Group Management** - Create and join family groups
- **Task Management** - Create, assign, and complete tasks
- **Points System** - Earn points for completing tasks
- **Wishlist** - Create wishlists for rewards
- **Notifications** - Stay updated on family activities
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Icons**: Lucide React
- **Forms**: React Hook Form (ready to integrate)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Usage

### Authentication
- Create a new account by clicking "Sign up" on the login page
- Use any email and password for testing (mock authentication)

### Navigation
- Use the top navigation (desktop) or bottom navigation (mobile) to switch between sections
- Access your profile and logout from the user menu

### Current State
This is a functional prototype with mock data. All features are interactive but data is not persisted between sessions.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Basic UI components
│   └── Layout.tsx      # Main app layout
├── pages/              # Page components
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Next Steps

To evolve this prototype into a production application:

1. **Backend Integration** - Replace mock stores with real API calls
2. **Database** - Add persistent storage (Firebase, Supabase, etc.)
3. **Real-time Updates** - Implement WebSocket connections
4. **Push Notifications** - Add mobile push notifications
5. **Image Upload** - Add avatar and group photo upload
6. **Testing** - Add comprehensive test coverage
7. **Deployment** - Set up CI/CD pipeline

## Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Type Check**: `npm run type-check` (if configured)
- **Lint**: `npm run lint` (if configured)
