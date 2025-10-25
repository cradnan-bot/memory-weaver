# Memory Weaver

A beautiful photo management app with dark theme UI, Supabase authentication, and photo storage functionality.

## Features

- 🔐 **Secure Authentication** - User registration and login with Supabase
- 📸 **Photo Upload & Storage** - Upload and organize your memories
- 🎨 **Beautiful Dark Theme** - Modern UI with purple accents
- 📱 **Responsive Design** - Works on desktop and mobile
- ☁️ **Cloud Storage** - Secure photo storage with Supabase

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set Up Supabase Storage

In your Supabase dashboard:

1. Go to Storage
2. Create a new bucket called `photos`
3. Set the bucket to public (or configure RLS policies as needed)

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Technology Stack

- **Frontend**: React + Vite
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: Custom CSS with dark theme
- **Deployment**: Vercel (recommended)

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Dark theme styles
├── supabase.js      # Supabase client configuration
└── main.jsx         # Application entry point
```

## Contributing

This is part of the Memory Weaver project - a digital sanctuary for cherished memories.

## License

Private project - All rights reserved.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
